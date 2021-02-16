import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../../Constants/index';

@Injectable()
export class DataManagmentService extends HttpService {

  private relativeUrl = '';

  public getAllActivityLists(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_ACTIVITY_CODE);
  }

  public getAllRolesLists(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ROLES_DATA);
  }

  public changeActivityList(action , data): Observable<any> {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.CHANGE_ACTIVITY_CODES + `?action=` + action, data);
  }

  public changeRolesList(action , data): Observable<any> {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.CHANGE_ROLE_CODES + `?action=` + action, data);
  }

  public getPeopleData(status): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_PEOPLE_DATE + `?status=` + status);
  }

  public getAssignedRoles(uidNo): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ASSIGNED_PERMISSIONS + `?uidNo=` + uidNo);
  }

  public submitPermissions(dataToPush, action): Observable<any> {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_USER_PERMISSIONS + `?action=` + action, dataToPush);
  }
}
