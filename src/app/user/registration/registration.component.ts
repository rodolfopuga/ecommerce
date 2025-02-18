import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor(public service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {

    this.service.formModel.reset();
  }

  onSubmit(){
    this.service.register().subscribe(
      (res: any) => {
        if (res.succeeded){
          this.service.formModel.reset();
          this.toastr.success('Nuevo usuario creado!', 'Registro con exito.');
        }else {
          res.errors.forEach(element => {
            switch (element.code){
              case 'DuplicateUserName':
                this.toastr.error('Nombre de usuario ya existe', 'Registro fallido.');
                // Username is already taken
                break;

                default:
                  this.toastr.error(element.description, 'Registro fallido.');
                  // Registration failed.
                  break;
            }
          });
        }
      },
      err => {
        console.log(err);
      }
    );
  }

}
