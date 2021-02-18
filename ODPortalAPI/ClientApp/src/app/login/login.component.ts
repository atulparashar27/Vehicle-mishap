import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User, AuthenticationResponse } from '../utils/types/common';
import { LoginService } from '../utils/services/login/login.service';
import { CONSTANTS } from '../utils/Constants/index';
import { UtilsService, AlertService } from '../utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  private localStorageObjectNames = CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES;
  public user: User = { username : '', password : ''};
  constructor(private router: Router, private loginService: LoginService,
    public utilsService: UtilsService, public alertService: ToastrService,
    public spinner: NgxSpinnerService) {}

 ngOnInit() {
  this.spinner.show(undefined, {type: 'ball-fussion', color: 'rgba(100,149,237,.8)'});
  setTimeout(() => {
    this.spinner.hide();
  }, 500);
    if (this.loginService.isUserloggedIn()) {
     this.router.navigate(['/']);
    }
  }
  public login() {
    if (this.user.password != null && this.user.username != null) {
      this.spinner.show(undefined, {type: 'ball-fussion', color: 'rgba(100,149,237,.8)'});
      this.loginService.loginUserService(this.user).subscribe(
        (response) => {
          if (response.success === true) {
            const response_data: any = {};
            let userRoles: any = {};
            let userCodes = [];
            // clearing localStorage
            window.localStorage.clear();
            window.localStorage.removeItem(this.localStorageObjectNames.user_info);
            response_data.rollNo = response.data.rollNo;
            response_data.uidNo = response.data.uidNo;
            response_data.userName = response.data.userName;
            userRoles =  response.data.rolesDetailsList;
            userCodes = [... new Set(response.data.rolesDetailsList.map(s => s.roleId))];
            window.localStorage.setItem(this.localStorageObjectNames.user_info, JSON.stringify(response_data));
            window.localStorage.setItem(this.localStorageObjectNames.user_roles, JSON.stringify(userRoles));
            window.localStorage.setItem(this.localStorageObjectNames.userCodes, JSON.stringify(userCodes));
            // navigate to home page
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/login']);
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
                 '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
          setTimeout(() => { this.spinner.hide(); }, 500);
        },
        (error) => {
          setTimeout(() => { this.spinner.hide(); }, 500);
          const errMsg = this.utilsService.errorServiceHandler(error);
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
                 '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
      );
    }
  }
}
