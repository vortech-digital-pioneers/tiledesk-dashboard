import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Headers, RequestOptions } from '@angular/http';
import { AuthService } from '../core/auth.service';
import { AppConfigService } from '../services/app-config.service';


@Injectable()
export class TagsService {

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
    this.getToken();
  }


  getAppConfig() {
    this.SERVER_BASE_PATH = this.appConfigService.getConfig().SERVER_BASE_URL;
    console.log('AppConfigService getAppConfig (TAGS.SERV) SERVER_BASE_PATH', this.SERVER_BASE_PATH);
  }

  getCurrentProject() {
    this.auth.project_bs.subscribe((project) => {
      console.log('TAGS.SERV: SUBSCRIBE TO THE PROJECT PUBLISHED BY AUTH SERVICE ', project)
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
  // @ Read - Get tags
  // -------------------------------------------------------------------------------------
  public getTags(): Observable<[any]> {
    // https://tiledesk-server-pre.herokuapp.com/5e20a68e7c2e640017f2f40f/canned/  // example
    const url = this.SERVER_BASE_PATH + this.projectId + '/tags/'
    console.log('TAGS.SERV - GET CANNED-RES URL', url);


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);

    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }

  // -------------------------------------------------------------------------------------
  // @ Read - Get tag by id
  // -------------------------------------------------------------------------------------

  public getTagById(tagid: string): Observable<[any]> {
    const url = this.SERVER_BASE_PATH + this.projectId + '/tags/' + tagid
    console.log('TAGS.SERV - GET CANNED-RES URL', url);


    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);

    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }


  // -------------------------------------------------------------------------------------
  // @ Create - Save new tag
  // -------------------------------------------------------------------------------------

  public createTag(tagname: string, tagcolor: string) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'tag': tagname, 'color': tagcolor };

    console.log('TAGS.SERV CREATE TAGS BODY ', body);

    const url = this.SERVER_BASE_PATH + this.projectId + '/tags/'
    console.log('TAGS - CREATE TAGS URL', url);

    return this.http
      .post(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }

  // -------------------------------------------------------------------------------------
  // @ Update - update  tag
  // -------------------------------------------------------------------------------------
  public updateTag(tagname: string, newtagcolor: string,  tagid: string ) {

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'tag': tagname, 'color': newtagcolor };

    const url = this.SERVER_BASE_PATH + this.projectId + '/tags/' + tagid;
    console.log('TAGS.SERV UPDATE TAGS URL ', url);

    console.log('UPDATE TAGS REQUEST BODY ', body);
    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());

  }


  // -------------------------------------------------------------------------------------
  // @ Delete - tag
  // -------------------------------------------------------------------------------------
  public deleteTag(tagid: string, ) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const url = this.SERVER_BASE_PATH + this.projectId + '/tags/' + tagid;
    console.log('TAGS.SERV UPDATE TAGS URL ', url);

    return this.http
      .delete(url, options)
      .map((res) => res.json());
  }




}
