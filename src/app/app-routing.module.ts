import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './auth/auth.guard';
import { ProductosComponent } from './productos/productos.component';
import { NavbarComponent } from './top/navbar/navbar.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { CarritoComponent } from './productos/store/carrito/carrito.component';







const routes: Routes = [
  {path: '', redirectTo: '/user/login', pathMatch: 'full'},
  {
    path: 'user', component: UserComponent,
    children: [
      {path: 'registration', component: RegistrationComponent },
      {path: 'login', component: LoginComponent }
    ]
  },
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'forbidden', component: ForbiddenComponent},
  {path: 'productos', component: ProductosComponent, canActivate: [AuthGuard], data : {permittedRoles: ['Admin']}},
  {path: 'navbar', component: NavbarComponent},
  {path: 'carrito', component: CarritoComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
