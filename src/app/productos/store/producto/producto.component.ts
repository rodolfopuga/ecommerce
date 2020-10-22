import { Component, OnInit, Sanitizer, ViewChild } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CartService } from '../../../shared/cart.service';
import { Producto } from 'src/app/Models/ProductoModel';
import { Productos } from '../../../Models/Productos';



@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})


export class ProductoComponent implements OnInit {
  public product: Array<any> = [];
  base64Image: any;



  @ViewChild('quantity') quantityInput;
  Productos: any;


  constructor(
    private servicio: UserService,
    private sanitizer: DomSanitizer,
    private cartService: CartService
  ) {

    this.servicio.getproductos().subscribe(( Productos: any) => {
        console.log(Productos);
        this.product = Productos;
      });



  }

   ngOnInit(): void {
  }
  addToCart(pro_id: any) {
    this.cartService.AddProductToCart(pro_id, this.quantityInput.nativeElement.value);
  }
  Increase() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.Productos.quantity >= 1){
      value++;

      if (value > this.Productos.quantity) {
        // @ts-ignore
        value = this.Productos.quantity;
      }
    } else {
      return;
    }

    this.quantityInput.nativeElement.value = value.toString();
  }

  Decrease() {
    let value = parseInt(this.quantityInput.nativeElement.value);
    if (this.Productos.quantity > 0){
      value--;

      if (value <= 0) {
        // @ts-ignore
        value = 0;
      }
    } else {
      return;
    }
    this.quantityInput.nativeElement.value = value.toString();
  }
}


