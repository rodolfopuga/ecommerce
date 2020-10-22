import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../shared/user.service';
import { CartService } from '../../../shared/cart.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Producto } from 'src/app/Models/ProductoModel';
import { CartModelServer } from '../../../Models/cart.model';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.scss']
})
export class CarritoComponent implements OnInit {



  cartData: CartModelServer;
  cartTotal: Number;
  subTotal: number;
  base64Image: any;




  constructor(
    public cartService: CartService
  ) {




  }

   ngOnInit(): any {
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

   }
   ChangeQuantity(index: number, increaseQuantity: boolean) {
    this.cartService.UpdateCartData(index, increaseQuantity);
  }

}
