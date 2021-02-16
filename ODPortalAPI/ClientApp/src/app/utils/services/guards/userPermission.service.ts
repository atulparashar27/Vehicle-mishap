import { Injectable } from '@angular/core';
import { CONSTANTS } from './../../Constants/index';
import { LocalStorage } from './../util.service';

@Injectable()
export class UserPermissionService {
  constructor(private localStorage: LocalStorage) {}

  /**
   * @function getUserPermissionByCode
   * @param permission code
   * @description get User Permission By Code
   */
  getUserPermissionByCode(code) {
    const userPermissionInfo = this.localStorage.getUserPermissionInfo();
    if (userPermissionInfo[code] && userPermissionInfo[code].hasPermission) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @function getCurrUrlMenuCode
   * @description get Current Url Menu Code
   */
  getCurrUrlMenuCode(res, stateUrl) {
    let validObj;
    for (let count = 0; count < res.length; count++) {
      if (res[count].routeUrl === stateUrl) {
        validObj = res[count];
        let childValidObj;
        if (res[count].children.length > 0) {
          childValidObj = this.getCurrUrlMenuCode(res[count].children, stateUrl);
          if (childValidObj) {
            validObj = childValidObj;
          }
        }
        break;
      } else if (res[count].children.length > 0) {
        validObj = this.getCurrUrlMenuCode(res[count].children, stateUrl);
        if (validObj) {
          break;
        }
      }
    }
    return validObj;
  }
}
