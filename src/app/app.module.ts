import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { UserService } from './shared/user.service';
import { LoginComponent } from './user/login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ProductosComponent } from './productos/productos.component';
import { StoreComponent } from './productos/store/store.component';
import { NavbarComponent } from './top/navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { ProductoComponent } from './productos/store/producto/producto.component';
import { FiltrosComponent } from './productos/store/filtros/filtros.component';
import { CarritoComponent } from './productos/store/carrito/carrito.component';
import { ProductoListComponent } from './productos/store/producto-list/producto-list.component';
import { SafePipe } from './safe.pipe';
import { ForbiddenComponent } from './forbidden/forbidden.component';




@NgModule({
  declarations: [
    AppComponent,
    UserComponent,
    RegistrationComponent,
    LoginComponent,
    HomeComponent,
    ProductosComponent,
    StoreComponent,
    NavbarComponent,
    FooterComponent,
    ProductoComponent,
    FiltrosComponent,
    CarritoComponent,
    ProductoListComponent,
    SafePipe,
    ForbiddenComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot({
      progressBar: true
    })
  ],
  providers: [UserService, {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
