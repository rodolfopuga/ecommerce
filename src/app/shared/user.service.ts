import { Injectable } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Producto } from '../Models/ProductoModel';
import { Observable, ReplaySubject } from 'rxjs';
import { Productos } from '../Models/Productos';
import { element } from 'protractor';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private fb: FormBuilder, private http: HttpClient) { }
readonly BaseURL = 'https://localhost:44329/api';

  formModel = this.fb.group({
    UserName : ['', Validators.required],
    Email : ['', Validators.email],
    FullName : [''],
    Passwords : this.fb.group({
      Password : ['', [Validators.required, Validators.minLength(6)]],
    ConfirmPassword : ['', Validators.required]
  }, {validators : this.comparePasswords })
  });
  comparePasswords(fb: FormGroup){
    // tslint:disable-next-line: prefer-const
    let confirmPswrdCtrl = fb.get('ConfirmPassword');
    // passwordMismatch
    // confirmPswrdCtrl.errors={passwordMismatch:true}
    if (confirmPswrdCtrl.errors == null || 'passwordMismatch' in confirmPswrdCtrl.errors) {
      // tslint:disable-next-line: curly
      if (fb.get('Password').value != confirmPswrdCtrl.value)
      confirmPswrdCtrl.setErrors({passwordMismatch: true});
      // tslint:disable-next-line: curly
      else
        confirmPswrdCtrl.setErrors(null);
    }
  }

  register(){
    const body = {
      UserName: this.formModel.value.UserName,
      Email: this.formModel.value.Email,
      FullName: this.formModel.value.FullName,
      Password: this.formModel.value.Passwords.Password
    };
    return this.http.post(this.BaseURL + '/ApplicationUser/Register', body);
  }

  login(formData){
    return this.http.post(this.BaseURL + '/ApplicationUser/Login', formData);

  }
  getUserProfile(){
    // tslint:disable-next-line: prefer-const
    return this.http.get(this.BaseURL + '/UserProfile');
  }

    roleMatch(allowedRoles): boolean {
      let isMatch = false;
      const payload = JSON.parse(window.atob(localStorage.getItem('token').split('.')[1]));
      const userRole = payload.role;
      // tslint:disable-next-line: no-shadowed-variable
      allowedRoles.forEach( element => {
        if (userRole == element) {
          isMatch = true;
          return false;
        }
      });
      return isMatch;
    }


  addproducto( producto: Producto){

    const data = new Producto();
    data.pro_nombre = producto.pro_nombre;
    data.pro_descripcion = producto.pro_descripcion;
    data.pro_precio = producto.pro_precio;
    data.pro_cantidad = producto.pro_cantidad;
    data.pro_img = producto.pro_img;
    data.imgstring = producto.imgstring;
    const url = this.BaseURL + '/producto';
    this.http.post(url, data)
    .subscribe(resp => {
      console.log(resp);
     });

    }

    getproductos(): Observable<Productos> {
      return this.http.get<Productos>(this.BaseURL + '/producto');
    }



    /* obtener un solo producto */
  getSingleProduct(pro_id: number): Observable<Producto> {
    return this.http.get<Producto>(this.BaseURL + '/producto/' + pro_id);
}
}
