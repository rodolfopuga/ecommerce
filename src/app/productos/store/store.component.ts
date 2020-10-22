import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { Productos } from '../../Models/Productos';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: []
})
export class StoreComponent implements OnInit {
 public product: Array<any> = []




  constructor(
    private servicio: UserService
  ) {

      // tslint:disable-next-line: no-shadowed-variable
      this.servicio.getproductos().subscribe(( Productos: any) => {
        console.log(Productos);
        this.product = Productos
      });

  }

   ngOnInit(): void {
  }


 /* ngOnInit() {
  this.servicio.getproductos().subscribe(
    res => {
      this.productoDetails = res;
    },
    err => {
      console.log(err);
    },
  );
 } */
}

