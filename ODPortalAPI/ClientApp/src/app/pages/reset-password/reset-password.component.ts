import { Component, OnInit } from '@angular/core';
import { CONSTANTS } from 'app/utils/Constants';
import { LoginService } from 'app/utils/services/login/login.service';
import { ProfileService } from 'app/utils/services/profile/profile.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  public userData: any = '';
  newPassword = '';
  retypePassword = '';
  constructor(public utilsService: UtilsService, public alertService: ToastrService,
    public profileService: ProfileService, private spinner: NgxSpinnerService,
    private loginService: LoginService) { }
  ngOnInit() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    setTimeout(() => {
      this.spinner.hide();
    }, 1000);
    this.userData = this.loginService.getUserloggedIn();
  }

  viewPassword() {
    const passwordInput: any = document.getElementById('newPassword');
    const passwordInput1: any = document.getElementById('newPassword1');
    const passStatus: any = document.getElementById('pass-status');
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      passwordInput1.type = 'text';
      passStatus.className = 'fa fa-eye-slash';
    } else {
      passwordInput.type = 'password';
      passwordInput1.type = 'password';
      passStatus.className = 'fa fa-eye';
    }
  }

  validatePassword() {
    if (this.newPassword === this.retypePassword) {
      if (this.newPassword.length > 5) {
        this.callResetAction();
      }
    } else {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Password do not match.',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
  }

  callResetAction() {
    const userDetails = {
      username: this.userData.uidNo,
      password: this.retypePassword
    };
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.profileService.callResetPassword(userDetails).subscribe(
      (response) => {
        if (response.success) {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Password reset successfully',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);

          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'You will be logged out shortly',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);

          setTimeout(() => {
            this.loginService.logOutUser();
            this.spinner.hide();
          }, 3000);

        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.errMessage,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
        }
        setTimeout(() => { this.spinner.hide(); }, 1000);
      },
      (error) => {
        // set loading to false on error
        this.spinner.hide();
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
      }
    );
  }
}
