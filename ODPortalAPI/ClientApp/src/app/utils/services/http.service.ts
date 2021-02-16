import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs';
import { map } from 'rxjs/operators';

import { CONSTANTS } from '../../utils/Constants/index';
import { Grade } from '../types/grade';
import { AuthenticationResponse } from '../types/common';
import { AlertService } from './util.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export abstract class HttpService {

  protected hostUrl = CONSTANTS.MAIN.APP.MAIN_URL.HOST_URL;
  public httpOptions = {
    headers : new HttpHeaders({
       'Content-Type': 'application/json'
      }).append('Access-Control-Allow-Origin', '*')
  };

  // tslint:disable-next-line: max-line-length
  constructor(private http: HttpClient, protected router: Router , private route: ActivatedRoute , protected alertService: AlertService) {}

  /**
     * @property : headers
     * @description : to construct http request header with api-version and authorization bearer token
     */
  protected get headers(): HttpHeaders {
    const headers: HttpHeaders = new HttpHeaders();
    // const authenticationToken: AuthenticationResponse = JSON.parse(localStorage.getItem('authentication_token'));
    // // check authenticationToken w.r.t time
    // tslint:disable-next-line: max-line-length
    // if ((authenticationToken && authenticationToken.token && authenticationToken.token.trim() !== '') && (authenticationToken.expiryTime > new Date().getTime())) {
    //   headers.append('Authorization', 'Bearer ' + authenticationToken.token);
    // } else {
    //  // this.router.navigate(['/login']);
    // }
    return headers;
  }

  /**
   * @function : get
   * @description : to construct http get request with relative url
   */
  protected postWithoutHeaders(relativeUrl: string, data): Observable<any> {
    // return this.http.post(this.hostUrl + relativeUrl, data);
    return this.http.post(this.hostUrl + relativeUrl, data, this.httpOptions);
  }

  /**
     * @function : get
     * @description : to construct http get request with relative url
     */
    protected get(relativeUrl: string): Observable<any> {
      return this.http.get(this.hostUrl + relativeUrl, {headers: this.headers});
    }

  /**
     * @function : downloadFile
     * @description : to construct http request with response type blob with relative url
     */
  // protected downloadFile(relativeUrl: string): Observable<any> {
  //   return this.http.get(this.hostUrl + relativeUrl, {headers: this.headers, responseType: ResponseContentType.Blob });
  // }

  /**
     * @function : post
     * @description : to construct http post request with relative url and data
     */
  // protected post(relativeUrl: string, data: any) {
  //   const timeStamp = +new Date();
  //   const timeZoneOffset = (new Date()).getTimezoneOffset();
  //   if (relativeUrl.indexOf('?') > -1) {
  //     relativeUrl = relativeUrl + `&tsp=${timeStamp}&timeoffset=${timeZoneOffset}`;
  //   } else {
  //     relativeUrl = relativeUrl + `?tsp=${timeStamp}&timeoffset=${timeZoneOffset}`;
  //   }
  //   return this.http.post(this.hostUrl + relativeUrl, data , {headers: this.headers});
  // }

  /**
   * @function : put
   * @description : to construct http put request with relative url and data
  */
  // protected put(relativeUrl: string, data: any) {
  //   const timeStamp = +new Date();
  //   const timeZoneOffset = (new Date()).getTimezoneOffset();
  //   if (relativeUrl.indexOf('?') > -1) {
  //     relativeUrl = relativeUrl + `&tsp=${timeStamp}&timeoffset=${timeZoneOffset}`;
  //   } else {
  //     relativeUrl = relativeUrl + `?tsp=${timeStamp}&timeoffset=${timeZoneOffset}`;
  //   }
  //   return this.http.post(this.hostUrl + relativeUrl, data , {headers: this.headers});
  // }

  /**
   * @function : delete
   * @description : to construct http post request with relative url and data
  */
  // protected delete(relativeUrl: string) {
  //   return this.http.delete(this.hostUrl + relativeUrl, {headers: this.headers});
  // }

  /**
   * @function : getAbosulteURl
   * @description : to get any data from an absoulte url
  */
  protected getAbosulteURl(absoluteUrl: string): Observable<any> {
    return this.http.get(absoluteUrl).pipe(map(res => res));
  }
}
