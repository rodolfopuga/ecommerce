import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/user.service';

@Component({
  selector: 'app-producto-list',
  templateUrl: './producto-list.component.html',
  styleUrls: ['./producto-list.component.css']
})
export class ProductoListComponent implements OnInit {
  public product: Array<any> = [ ];




  constructor(
    private servicio: UserService
  ) {

      // tslint:disable-next-line: no-shadowed-variable
      this.servicio.getproductos().subscribe(( Productos: any) => {
        console.log(Productos);
        this.product = Productos;
      });

  }

   ngOnInit(): void {
  }
}
