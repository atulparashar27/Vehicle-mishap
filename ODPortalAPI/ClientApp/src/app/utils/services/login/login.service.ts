import { Injectable } from '@angular/core';

import {Router} from '@angular/router';

import { HttpService } from '../../services/http.service';

import { Observable } from 'rxjs';

import { AuthenticationResponse, User } from '../../types/common';
import { CONSTANTS } from '../../Constants/index';

@Injectable()
export class LoginService extends HttpService {
  private relativeUrl: String = '';
  // getting user authenticate url
  private loginUrl = CONSTANTS.MAIN.APP.URLS.AUTHENTICATE_USER;
  // to check if a user is logged in
  public isloggedIn = false;

  // loading constants for local storage
  private localStorageObjectNames = CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES;

  /**
   * @function : isUserloggedIn
   * @description : to check for authorization bearer token
  */
  public isUserloggedIn(): boolean {
    // const auth_info: AuthenticationResponse = JSON.parse(window.localStorage.getItem(this.localStorageObjectNames.auth_token));
    const user_info: User = JSON.parse(window.localStorage.getItem(this.localStorageObjectNames.user_info));
    if ( (user_info != null )) {
      this.isloggedIn = true;
      return this.isloggedIn;
    }
    this.isloggedIn = false;
    return this.isloggedIn;
  }

  public getUserRoles(): any {
    const user_roles = JSON.parse(window.localStorage.getItem(this.localStorageObjectNames.user_roles));
    if (user_roles) {
      return user_roles;
    } else {
      return false;
    }
  }
  /**
   * @function : getUserloggedIn
   * @description : toget user information
  */
  public getUserloggedIn(): any {
    const user_info = JSON.parse(window.localStorage.getItem(this.localStorageObjectNames.user_info));
    if (user_info) {
      return user_info;
    } else {
      // redirect to login page if user information is not present
      this.logOutUser();
    }
  }

  /**
   * @function : logOutUser
   * @description : to delete authorization bearer token and user information
  */
  public logOutUser() {
    window.localStorage.clear();
    this.isloggedIn = false;
    // redirect to login page after log out
    this.router.navigate(['\login']);
  }

  /**
   * @function loginUserService
   * @description : login User Service
   */
  public loginUserService(user: User): Observable<any> {
    return this.postWithoutHeaders(this.loginUrl, {username : user.username , password : user.password});
  }

  public getUserRoleId() {
    const userCodes = JSON.parse(window.localStorage.getItem(this.localStorageObjectNames.userCodes));
    if (userCodes) {
      return userCodes;
    } else {
      // redirect to login page if user information is not present
      this.logOutUser();
    }
  }
}
