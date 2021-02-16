import { Injectable } from '@angular/core';
import { CONSTANTS } from 'app/utils/Constants';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends HttpService {

  private relativeUrl = '';

  /**
   * @function getDatesList
   * @description : get all activity list in drop down
   */
  public getAllActivityLists(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_ACTIVITY_CODE);
  }

  getBranchPeopleAttendance(dataToPush) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_BRANCH_PEOPLE_ATTENDANCE, dataToPush);
  }
}
