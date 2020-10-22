import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../../shared/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent implements OnInit {
  formModel = {
    UserName : '',
    Password : ''
  };

  constructor(private service: UserService, private router: Router, private toastr: ToastrService) { }

  ngOnInit() {
    // tslint:disable-next-line: curly
    if (localStorage.getItem('token') != null)
    this.router.navigateByUrl('/home');
  }

  onSubmit(form: NgForm){
this.service.login(form.value).subscribe(
  (res: any) => {
    localStorage.setItem('token', res.token);
    this.router.navigateByUrl('/home');
  },
  err => {
    // tslint:disable-next-line: curly
    if (err.status == 400)
      this.toastr.error('Usuario o contraseña incorrectos', 'Conexion invalida.');
    // tslint:disable-next-line: curly
    else
      console.log(err);
  }
);
  }

}
