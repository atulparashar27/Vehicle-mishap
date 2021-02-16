import { Injectable } from '@angular/core';
import { CanActivateChild, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LocalStorage, UtilsService, AlertService } from './../util.service';
import { CONSTANTS } from './../../Constants/index';
import { UserPermissionService } from './../../services/guards/userPermission.service';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class PermissionAccessGuard implements CanActivate {
  public stateUrl = '';   // get current url
  constructor(private router: Router, private http: HttpClient, private localStorage: LocalStorage,
     private userPermissionService: UserPermissionService, private utilService: UtilsService, public alertService: ToastrService ) {}

  /**
   * @function canActivate
   * @description can Activate lifecycle hook
   */
  canActivate(activateRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
    // check if a user is having permission access for the route
    this.stateUrl = state.url;
    return this.getMenuData();
  }

  /**
   * @function getMenuData
   * @description get Menu data
   */
  getMenuData() {
    const promise = new Promise((resolve, reject) => {
      this.http.get(CONSTANTS.MAIN.APP.URLS.GET_MENU_JSON)
        .toPromise()
        .then(
          (res: any) => { // Success
            const selectedObj = this.userPermissionService.getCurrUrlMenuCode(res, this.stateUrl);
            const menuCode = selectedObj ? selectedObj.menuCode : null;
            if (menuCode && this.utilService.hasUserPermission(menuCode)) {
              resolve(true);
            } else {
              this.router.navigate(['/dashboard']);
              this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'You don\'t have access to this page.',
                 '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
              resolve(false);
            }
          },
          msg => { // Error
            this.router.navigate(['/dashboard']);
            resolve(false);
          }
        );
    });
    return promise;
  }
}
