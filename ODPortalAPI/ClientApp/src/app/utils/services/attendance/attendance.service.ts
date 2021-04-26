import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpErrorResponse } from '@angular/common/http';

import { HttpService } from '../../services/http.service';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../../Constants/index';

@Injectable()
export class AttendanceService extends HttpService {

  private relativeUrl = '';

  /**
   * @function getDatesList
   * @description : get all activity list in drop down
   */
  public getAllActivityLists(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_ACTIVITY_CODE);
  }

  public getPeopleData(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_PEOPLE_DATE + `?status=CR`);
  }

  public saveSelectedAttendance(dataToSave): Observable<any> {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_SELECTED_RECORDS , dataToSave);
  }

  getActivityAttendance(code, date) {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_SAVED_ATTENDANCE + `?actCode=` + code + `&actDate=` + date);
  }

  saveVisitorsAttendance(postData) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_VISITORS_ATTENDANCE, postData);
  }

  deleteSelectedAttendance(data) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.DELETE_SELECTED_PEOPLE_ATTENDANCE, data);
  }

  voidSelectedAttendance(date, code) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.VOID_ATTENDANCE +
       `?actCode=` + code + `&actDate=` + date, {});
  }
}
