import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CONSTANTS } from '../Constants/index';
import { EventEmitter } from '@angular/core';

import { AlertMessage } from '../types/common';

@Injectable()

export class UtilsService {
  constructor(private router: Router , private route: ActivatedRoute) {}


  hasUserPermission(permissionCode) {
    if (localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.userCodes)) {
      const valueCheck = JSON.parse(localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.userCodes));
      const check = valueCheck.find(function(res) { return res === permissionCode; });
      if (check) {
        return true;
      } else {
        return false;
      }
    }
    // let userPermissionObj = null;
    // const userObj: any = localStorage.getItem('user_profile');
    // const userIsAdmin = (userObj ? JSON.parse(userObj).isAdmin : null);
    // if (localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.user_roles)) {
    //   userPermissionObj = JSON.parse(localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.user_roles));
    // }
    // if (userIsAdmin || (userPermissionObj && permissionCode && (userPermissionObj[permissionCode]
    //  && userPermissionObj[permissionCode].hasPermission))) {
    //     if (userIsAdmin && (userPermissionObj && permissionCode &&
    //  (userPermissionObj[permissionCode] && userPermissionObj[permissionCode].isNegativePermission))) {
    //       return false;
    //     } else {
    //       return true;
    //     }
    // } else {
    //  return true;
    // }
  }

  /***
  * @name errorServiceHandler
  * @desc handling service error status codes
  ***/
  errorServiceHandler(error) {
    // set error msg when service fails
    let errMsg = '';
    if (error.status === 0) {
      // if service could not be connected
      errMsg = CONSTANTS.MAIN.APP.MESSAGES.SERVICE_ERR;
    } else if (error.status === 401) {
      // if unauthorised request
      errMsg = CONSTANTS.MAIN.APP.MESSAGES.UNAUTH_ERR;
      localStorage.clear();
      this.router.navigate(['/login' ]);
    } else if (error.status === 400 && !error.response) {
      errMsg = error.title;
    } else if (error.status === 400 && error.response && error.response.Success === false) {
      errMsg = error.response.message;
    } else if (error.status === 404) {
      errMsg = CONSTANTS.MAIN.APP.MESSAGES.NOT_FOUND_ERR;
    } else if (error.status === 500) {
      errMsg = CONSTANTS.MAIN.APP.MESSAGES.ERR_CODE_500;
    } else {
      // other error codes
      errMsg = error.statusText + ' ' + error.status;
      if (error.status === 400 && !JSON.parse(error._body).Success) {
        errMsg = JSON.parse(error._body).message;
      }
    }
    return errMsg;
  }

  /**
   * @function getDateStringMMDDYYYY
   * @description : get date in string format
   */
  getDateStringMMDDYYYY(dateStr: string) {
    let _dateStr;
    if (dateStr == null || dateStr === '') {
      return '';
    } else {
      _dateStr = new Date(dateStr);
      return ('0' + (_dateStr.getMonth() + 1)).slice(-2) + '/' + ('0' + _dateStr.getDate()).slice(-2) + '/' + _dateStr.getFullYear();
    }
  }

  /**
   * @function dateDiffInDays
   * @param  a and b are javascript Date objects
   * @description : get date difference in days
   */
  dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    // b - a is returned

    return Math.floor((utc2 - utc1) / (1000 * 60 * 60 * 24));
  }

  /**
   * @function getPhoneMask
   * @description : get phone mask
   */
  getPhoneMask(phoneNumber) {
    let newVal = phoneNumber.replace(/\D/g, '');
    newVal = newVal.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) ($2)-$3');
    return newVal;
  }

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }

    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }

  formatDateDDMMYYY(date) {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');
    return formattedDate;
  }
}


export class AlertService {
  alertMessage: EventEmitter<AlertMessage> = new EventEmitter();
  constructor() { }
  emitAlertMessageChangeEvent(alertMessage) {
    if (alertMessage) {
      this.alertMessage.emit(alertMessage);
    }

  }
  getAlertMessageChangeEmitter() {
    return this.alertMessage;
  }
}

export class LocalStorage {
  constructor() {}
  /**
   * @function saveLocalStorage
   * @param key
   * @param value
   * @description set to local storage
   */
  saveLocalStorage(key: string, value: any) {
    localStorage.setItem(key, this.stringifyIfJson(value));
  }

  /**
   * @function fetchLocalStorage
   * @param key
   * @description get from local storage
   */
  fetchLocalStorage(key: string): JSON {
    return JSON.parse(localStorage.getItem(key));
  }
  /**
   * @function removeLocalStorage
   * @param key
   * @description remove from local storage
   */
  removeLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  /**
   * @function exists
   * @param key
   * @description return true if key already exists in local storage
   */
  exists(key: string): boolean {
    return ( (localStorage.getItem(key) !== undefined) || (localStorage.getItem(key) != null) );
  }

  /**
   * @function stringifyIfJson
   * @param value
   * @description to retun stringified json
   */
  private stringifyIfJson(value: any) {
    if (typeof value === 'object' ) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  }

  getUserPermissionInfo(): JSON {
    if (localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.user_roles)) {
      return JSON.parse(localStorage.getItem(CONSTANTS.MAIN.APP.CONSTANTS.LOCAL_STORAGE_OBJECT_NAMES.user_roles));
    } else {
      return null;
    }
  }
}
