import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../shared/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private service: UserService){

  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      // tslint:disable-next-line: curly
      if (localStorage.getItem('token') != null){
        const roles = next.data.permittedRoles as Array<string>;
        if (roles){
          if(this.service.roleMatch(roles)) return true;
          else{
            this.router.navigate(['/forbidden']);
          }

        }
        return true;
      }
    else{
    this.router.navigate(['/user/login']);
    return false;
    }
  }

}
