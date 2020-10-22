import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Producto } from '../Models/ProductoModel';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: []
})
export class ProductosComponent implements OnInit {
  userDetails;

  miformulario: FormGroup;

  imagen: File;
  Imange1: any;

  constructor(private router: Router, private service: UserService, private fb: FormBuilder, private http: HttpClient) {

   }

  ngOnInit(): void {

    this.miformulario = this.fb.group({
      pro_nombre: [''],
      pro_descripcion: [''],
      pro_precio: [''],
      pro_cantidad: [''],
      pro_img: ['']
    });

  }

  onSubmit(formValue: any){

    const producto = new Producto();
    producto.pro_nombre = formValue.pro_nombre;
    producto.pro_descripcion = formValue.pro_descripcion;
    producto.pro_precio = formValue.pro_precio;
    producto.pro_cantidad = formValue.pro_cantidad;
    producto.imgstring = this.Imange1;
    producto.pro_img = null;

    this.service.addproducto(producto);


  }

  selectImage1(archivo: File) {

    if (!archivo) {
      this.imagen = null;
      return;
    }

    if (archivo.type.indexOf('image') < 0) {
      alert('El archivo seleccionado no es una imagen');
      this.imagen = null;
      return;
    }

    this.imagen = archivo;
    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.Imange1 = reader.result.toString();



  }




  onLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/user/login']);
  }
}
