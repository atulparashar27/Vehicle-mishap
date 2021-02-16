import { Injectable } from '@angular/core';

import { HttpService } from '../http.service';
import { Observable } from 'rxjs';
import { CONSTANTS } from '../../Constants/index';

@Injectable()
export class ProfileService extends HttpService {

  private relativeUrl = '';

  public getProfileDataList(uidNo, rollNo): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_PROFILE_DATA + `?uidNo=` + uidNo + `&rollNo=` + rollNo);
  }

  public callResetPassword(data): Observable<any> {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.CALL_RESET_PASSWORD, data);
  }

  savePersonalDetails(dataToPush, uidNo) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_PERSONAL_INFO + `?uidNo=` + uidNo, dataToPush);
  }

  saveContactDetails(dataToPush, uidNo) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_CONTACT_INFO + `?uidNo=` + uidNo, dataToPush);
  }

  saveCompanyDetails(dataToPush, uidNo) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_COMPANY_INFO + `?uidNo=` + uidNo, dataToPush);
  }

  saveQualificationDetails(dataToPush, uidNo) {
    return this.postWithoutHeaders(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.SAVE_QUALIFICATION_INFO + `?uidNo=` + uidNo, dataToPush);
  }

  getFamilyDetails(uidNo): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_FAMILY_DETAILS + `?uidNo=` + uidNo);
  }
}
