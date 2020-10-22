import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent implements OnInit {

  public openCart:boolean = false;
  
  public cart(){ //Se usa para abrir o cerrar el carrito
    this.openCart = !this.openCart;
  } 
  
  constructor(private router: Router){

  }

  ngOnInit(): void {
  }

  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }

}
