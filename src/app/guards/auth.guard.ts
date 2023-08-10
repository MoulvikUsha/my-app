import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authservice: AuthService, private router: Router, private toastr: ToastrService) {
    // sessionStorage.clear();
  }

  canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authservice.isLoggedIn()) {
      if (route.url.length > 0) {
        let path = route.url[0].path;
        if (path == 'user') {
          if (this.authservice.getUserRole() == 'admin') {
            return true
          }
          else {
            this.toastr.warning('You dont have access');
            this.router.navigate(['/home']);
            return false
          }
        }
        else {
          return true
        }
      }
      else {
        return true;
      }
    }
    else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
