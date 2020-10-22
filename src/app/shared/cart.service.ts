import {Injectable} from '@angular/core';
import { UserService } from './user.service';
import {BehaviorSubject} from 'rxjs';
import {CartModelPublic, CartModelServer} from '../models/cart.model';
import {Producto} from '../Models/ProductoModel';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {NavigationExtras, Router} from '@angular/router';
/* import {OrderService} from "./order.service"; */
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})


export  class CartService {

  /* private ServerURL = environment.serverURL; */

  // tslint:disable-next-line: max-line-length
  private cartDataClient: CartModelPublic = {prodData: [{incart: 0, pro_id: 0}], Total: 0};  // This will be sent to the backend Server as post data
  // Cart Data variable to store the cart information on the server
  private cartDataServer: CartModelServer = {
    data: [{
      product: undefined,
      numInCart: 0
    }],
    total: 0
  };

  // tslint:disable-next-line: ban-types
  cartTotal$ = new BehaviorSubject<Number>(0);
  // Data variable to store the cart information on the client's local storage

  cartDataObs$ = new BehaviorSubject<CartModelServer>(this.cartDataServer);


  constructor(private productService: UserService,
              /* private orderService: OrderService, */
              private httpClient: HttpClient,
              private router: Router,
              private spinner: NgxSpinnerService,
              private toast: ToastrService) {

    this.cartTotal$.next(this.cartDataServer.total);
    this.cartDataObs$.next(this.cartDataServer);

    const info: CartModelPublic = JSON.parse(localStorage.getItem('cart'));

    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // assign the value to our data variable which corresponds to the LocalStorage data format
      this.cartDataClient = info;
      // Loop through each entry and put it in the cartDataServer object
      this.cartDataClient.prodData.forEach(p => {
        this.productService.getSingleProduct(p.pro_id).subscribe((actualProdInfo: Producto) => {
          if (this.cartDataServer.data[0].numInCart === 0) {
            this.cartDataServer.data[0].numInCart = p.incart;
            this.cartDataServer.data[0].product = actualProdInfo;
            this.CalculateTotal();
            this.cartDataClient.Total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          } else {
            this.cartDataServer.data.push({
              numInCart: p.incart,
              product: actualProdInfo
            });
            this.CalculateTotal();
            this.cartDataClient.Total = this.cartDataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
          }
          this.cartDataObs$.next({...this.cartDataServer});
        });
      });
    }
  }

  // tslint:disable-next-line: ban-types
  CalculateSubTotal(index): Number {
    let subTotal = 0;

    let p = this.cartDataServer.data[index];
    // @ts-ignore
    subTotal = p.product.pro_precio * p.numInCart;

    return subTotal;
  }

  // tslint:disable-next-line: ban-types
  // tslint:disable-next-line: variable-name
  AddProductToCart(pro_id: any, pro_cantidad?: number) {

    this.productService.getSingleProduct(pro_id).subscribe(prod => {
      // If the cart is empty
      if (this.cartDataServer.data[0].product === undefined) {
        this.cartDataServer.data[0].product = prod;
        this.cartDataServer.data[0].numInCart = pro_cantidad !== undefined ? pro_cantidad : 1;
        this.CalculateTotal();
        this.cartDataClient.prodData[0].incart = this.cartDataServer.data[0].numInCart;
        this.cartDataClient.prodData[0].pro_id = prod.pro_id;
        this.cartDataClient.Total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
        this.toast.success(`${prod.pro_nombre} added to the cart.`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }  // END of IF
      // Cart is not empty
      else {
        const index = this.cartDataServer.data.findIndex(p => p.product.pro_id === prod.pro_id);

        // 1. If chosen product is already in cart array
        if (index !== -1) {

          if (pro_cantidad !== undefined && pro_cantidad <= prod.pro_cantidad) {
            // @ts-ignore
            // tslint:disable-next-line: max-line-length
            this.cartDataServer.data[index].numInCart = this.cartDataServer.data[index].numInCart < prod.pro_cantidad ? pro_cantidad : prod.pro_cantidad;
          } else {
            // @ts-ignore
            // tslint:disable-next-line: no-unused-expression
            this.cartDataServer.data[index].numInCart < prod.pro_cantidad ? this.cartDataServer.data[index].numInCart++ : prod.pro_cantidad;
          }


          this.cartDataClient.prodData[index].incart = this.cartDataServer.data[index].numInCart;
          this.toast.info(`${prod.pro_nombre} quantity updated in the cart.`, 'Product Updated', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        // 2. If chosen product is not in cart array
        else {
          this.cartDataServer.data.push({
            product: prod,
            numInCart: 1
          });
          this.cartDataClient.prodData.push({
            incart: 1,
            pro_id: prod.pro_id
          });
          this.toast.success(`${prod.pro_nombre} added to the cart.`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
        }
        this.CalculateTotal();
        this.cartDataClient.Total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
        this.cartDataObs$.next({...this.cartDataServer});
      }  // END of ELSE


    });
  }

  // tslint:disable-next-line: ban-types
  UpdateCartData(index, increase: Boolean) {
    const data = this.cartDataServer.data[index];
    if (increase) {
      // @ts-ignore
      // tslint:disable-next-line: no-unused-expression
      data.numInCart < data.product.pro_cantidad ? data.numInCart++ : data.product.pro_cantidad;
      this.cartDataClient.prodData[index].incart = data.numInCart;
      this.CalculateTotal();
      this.cartDataClient.Total = this.cartDataServer.total;
      this.cartDataObs$.next({...this.cartDataServer});
      localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
    } else {
      // @ts-ignore
      data.numInCart--;

      // @ts-ignore
      if (data.numInCart < 1) {
        this.DeleteProductFromCart(index);
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        // @ts-ignore
        this.cartDataObs$.next({...this.cartDataServer});
        this.cartDataClient.prodData[index].incart = data.numInCart;
        this.CalculateTotal();
        this.cartDataClient.Total = this.cartDataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

    }

  }

  DeleteProductFromCart(index) {
        console.log(this.cartDataClient.prodData[index].pro_id);
        console.log(this.cartDataServer.data[index].product.pro_id);

        if (window.confirm('Are you sure you want to delete the item?')) {
      this.cartDataServer.data.splice(index, 1);
      this.cartDataClient.prodData.splice(index, 1);
      this.CalculateTotal();
      this.cartDataClient.Total = this.cartDataServer.total;

      if (this.cartDataClient.Total === 0) {
        this.cartDataClient = {prodData: [{incart: 0, pro_id: 0}], Total: 0};
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
      }

      if (this.cartDataServer.total === 0) {
        this.cartDataServer = {
          data: [{
            product: undefined,
            numInCart: 0
          }],
          total: 0
        };
        this.cartDataObs$.next({...this.cartDataServer});
      } else {
        this.cartDataObs$.next({...this.cartDataServer});
      }
    }
    // If the user doesn't want to delete the product, hits the CANCEL button
    else {
      return;
    }


  }

  /* CheckoutFromCart(userId: Number) {

    this.httpClient.post(`${this.ServerURL}orders/payment`, null).subscribe((res: { success: Boolean }) => {
      console.clear();

      if (res.success) {


        this.resetServerData();
        this.httpClient.post(`${this.ServerURL}orders/new`, {
          userId: userId,
          products: this.cartDataClient.prodData
        }).subscribe((data: OrderConfirmationResponse) => {

          this.orderService.getSingleOrder(data.order_id).then(prods => {
            if (data.success) {
              const navigationExtras: NavigationExtras = {
                state: {
                  message: data.message,
                  products: prods,
                  orderId: data.order_id,
                  total: this.cartDataClient.Total
                }
              };
              this.spinner.hide().then();
              this.router.navigate(['/thankyou'], navigationExtras).then(p => {
                this.cartDataClient = {prodData: [{incart: 0, id: 0}], Total: 0};
                this.cartTotal$.next(0);
                localStorage.setItem('cart', JSON.stringify(this.cartDataClient));
              });
            }
          });

        });
      } else {
        this.spinner.hide().then();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`Sorry, failed to book the order`, "Order Status", {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  } */
  

  private CalculateTotal() {
    let Total = 0;

    this.cartDataServer.data.forEach(p => {
      const {numInCart} = p;
      const {pro_precio} = p.product;
      // @ts-ignore
      Total += numInCart * pro_precio;
    });
    this.cartDataServer.total = Total;
    this.cartTotal$.next(this.cartDataServer.total);
  }

  private resetServerData() {
    this.cartDataServer = {
      data: [{
        product: undefined,
        numInCart: 0
      }],
      total: 0
    };
    this.cartDataObs$.next({...this.cartDataServer});
  }

}

interface OrderConfirmationResponse {
  order_id: Number;
  success: Boolean;
  message: String;
  products: [{
    pro_id: String,
    numInCart: String
  }];
}
