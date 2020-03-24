import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../core/auth.service';
import { AppConfigService } from '../services/app-config.service';

@Injectable()
export class CannedResponsesService {

  http: Http;
  projectId: string;
  TOKEN: any;
  SERVER_BASE_PATH: string;

  constructor(
    http: Http,
    public auth: AuthService,
    public appConfigService: AppConfigService
  ) {
    this.http = http;
    this.getAppConfig();
    this.getCurrentProject();
    this.getToken()
  }

  getAppConfig() {
    this.SERVER_BASE_PATH = this.appConfigService.getConfig().SERVER_BASE_URL;
    console.log('AppConfigService getAppConfig (CANNED-RES.SERV) SERVER_BASE_PATH', this.SERVER_BASE_PATH);
  }

  getCurrentProject() {
    this.auth.project_bs.subscribe((project) => {
      console.log('CANNED-RES.SERV: SUBSCRIBE TO THE PROJECT PUBLISHED BY AUTH SERVICE ', project)

      if (project) {
        this.projectId = project._id
      }
    })
  }

  getToken() {
    this.auth.user_bs.subscribe((user) => {
      if (user) {
        this.TOKEN = user.token
      }
    });
  }


  // -------------------------------------------------------------------------------------
  // @ Read - Get canned responses
  // -------------------------------------------------------------------------------------

  public getCannedResponses(): Observable<[any]> {
    // https://tiledesk-server-pre.herokuapp.com/5e20a68e7c2e640017f2f40f/canned/  // example
    const url = this.SERVER_BASE_PATH + this.projectId + '/canned/'
    console.log('CANNED-RES.SERV - GET CANNED-RES URL', url);


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);

    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }

  // -------------------------------------------------------------------------------------
  // @ Read - Get canned response by id
  // -------------------------------------------------------------------------------------

  public getCannedResponseById(cannedResponseId: string): Observable<[any]> {
    const url = this.SERVER_BASE_PATH + this.projectId + '/canned/' + cannedResponseId
    console.log('CANNED-RES.SERV - GET CANNED-RES URL', url);


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);

    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }


  // -------------------------------------------------------------------------------------
  // @ Create - Save new canned response
  // -------------------------------------------------------------------------------------

  public createCannedResponse(message: string, title?: string) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'text': message, 'title': title };

    console.log('CANNED-RES.SERV CREATE CANNED-RES BODY ', body);

    const url = this.SERVER_BASE_PATH + this.projectId + '/canned/'
    console.log('CANNED-RES.SERV - CREATE CANNED-RES URL', url);

    return this.http
      .post(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }

  // -------------------------------------------------------------------------------------
  // @ Update - update canned response
  // -------------------------------------------------------------------------------------
  public updateCannedResponse(message: string, cannedresid: string, title?: string) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'text': message, 'title': title };

    const url = this.SERVER_BASE_PATH + this.projectId + '/canned/' + cannedresid;
    console.log('CANNED-RES.SERV UPDATE CANNED-RES URL ', url);

    console.log('UPDATE CANNED-RES REQUEST BODY ', body);
    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());

  }

  // -------------------------------------------------------------------------------------
  // @ Delete - delete canned response
  // -------------------------------------------------------------------------------------
  public deleteCannedResponse(cannedresid: string, ) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const url = this.SERVER_BASE_PATH + this.projectId + '/canned/' + cannedresid;
    console.log('CANNED-RES.SERV UPDATE CANNED-RES URL ', url);
   
    return this.http
      .delete(url, options)
      .map((res) => res.json());
  }

}
