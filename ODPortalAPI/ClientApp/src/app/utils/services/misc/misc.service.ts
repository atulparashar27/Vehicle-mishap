import { Injectable } from '@angular/core';
import { CONSTANTS } from 'app/utils/Constants';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';

@Injectable()
export class MiscService extends HttpService {
  private relativeUrl = '';

  public getLocalityData(): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_LOCALITY_LIST);
  }

  getLocalityPeopleData(localityId): Observable<any> {
    return this.get(this.relativeUrl + CONSTANTS.MAIN.APP.URLS.GET_ALL_LOCALITY_PEOPLE_LIST + `?localityId=${localityId}`);
  }
}
