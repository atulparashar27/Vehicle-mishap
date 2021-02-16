import { Injectable } from '@angular/core';
import {CanActivateChild, CanActivate} from '@angular/router';
import { LoginService } from '../services/login/login.service';
import {Router} from '@angular/router';

@Injectable()
export class OnlyLoggedInUsersGuard implements CanActivate {
  constructor(private loginService: LoginService , private router: Router ) {}

  canActivate() {
    // check if a user is already logged in
    if (this.loginService.isUserloggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

