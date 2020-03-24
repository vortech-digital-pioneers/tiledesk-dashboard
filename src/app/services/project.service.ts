// tslint:disable:max-line-length
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Project } from '../models/project-model';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { environment } from '../../environments/environment';
import { AuthService } from '../core/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../services/app-config.service';

@Injectable()
export class ProjectService {

  http: Http;
  // PROJECT_BASE_URL = environment.mongoDbConfig.PROJECTS_BASE_URL;
  // BASE_URL = environment.mongoDbConfig.BASE_URL; // replaced with SERVER_BASE_PATH

  // SERVER_BASE_PATH = environment.SERVER_BASE_URL; // now get from appconfig
  // PROJECTS_URL = this.SERVER_BASE_PATH + 'projects/' // now built after get SERVER_BASE_PATH

  SERVER_BASE_PATH: string;
  PROJECTS_URL: string;

  // UPDATE_OPERATING_HOURS_URL: any; // NO MORE USED
  // PROJECT_USER_BASE_URL = environment.mongoDbConfig.PROJECT_USER_BASE_URL;
  // TOKEN = environment.mongoDbConfig.TOKEN;

  TOKEN: string;

  user: any;
  currentUserID: string;
  projectID: string;

  public myAvailabilityCount: BehaviorSubject<number> = new BehaviorSubject<number>(null);
  public hasCreatedNewProject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    http: Http,
    public auth: AuthService,
    public http_client: HttpClient,
    public appConfigService: AppConfigService
  ) {
    console.log('HELLO PROJECT SERVICE !!!!')

    this.http = http;

    this.user = auth.user_bs.value
    this.checkUser()

    this.auth.user_bs.subscribe((user) => {
      this.user = user;
      this.checkUser()
    });
    this.getAppConfigAndBuildUrl();
    this.getCurrentProject();

  }

  getAppConfigAndBuildUrl() {

    this.SERVER_BASE_PATH = this.appConfigService.getConfig().SERVER_BASE_URL;
    console.log('AppConfigService getAppConfig (PROJECT SERV.) SERVER_BASE_PATH ', this.SERVER_BASE_PATH);
    this.PROJECTS_URL = this.SERVER_BASE_PATH + 'projects/';
    console.log('AppConfigService getAppConfig (PROJECT SERV.) PROJECTS_URL (built with SERVER_BASE_PATH) ', this.PROJECTS_URL);
  }

  countOfMyAvailability(numOfMyAvailability: number) {

    console.log('============ PROJECT SERVICE - countOfMyAvailability ', numOfMyAvailability);
    this.myAvailabilityCount.next(numOfMyAvailability);
  }

  newProjectCreated(newProjectCreated: boolean) {
    console.log('PROJECT SERVICE - newProjectCreated ', newProjectCreated);
    this.hasCreatedNewProject$.next(newProjectCreated);
  }

  getCurrentProject() {
    console.log('============ PROJECT SERVICE - SUBSCRIBE TO CURRENT PROJ ============');
    // tslint:disable-next-line:no-debugger
    // debugger
    this.auth.project_bs.subscribe((project) => {

      if (project) {

        this.projectID = project._id;
        console.log('-- -- >>>> 00 -> PROJECT SERVICE project ID from AUTH service subscription ', this.projectID);
        // this.UPDATE_OPERATING_HOURS_URL = this.PROJECTS_URL + this.projectID;

        // PROJECT-USER BY PROJECT ID AND CURRENT USER ID
        // this.PROJECT_USER_URL = this.BASE_URL + this.project._id + '/project_users/'
      }
    });
  }

  checkUser() {
    if (this.user) {
      // this.currentUserFireBaseUID = this.user.uid
      this.currentUserID = this.user._id
      this.TOKEN = this.user.token
      console.log('!!! USER UID GET IN PROJECT SERV ', this.currentUserID);
      // this.getToken();
    } else {
      console.log('No user is signed in');
    }
  }

  /** ********************************************** HTTP VERSION *********************************************** */
  /* READ (GET ALL PROJECTS) */
  public getProjects(): Observable<Project[]> {
    const url = this.PROJECTS_URL;
    console.log('getProjects URL', url);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }

  /** ******************************************** HTTP CLIENT VERSION ******************************************** */
  /* READ (GET ALL PROJECTS) */
  // public getProjects(): Observable<Project[]> {
  //   const url = this.PROJECTS_URL;
  //   console.log('MONGO DB PROJECTS URL', url);
  //   const headers = new HttpHeaders({ 'Content-Type': 'application/json' }).set('Authorization', this.TOKEN)
  //   return this.http_client
  //     .get<Project[]>(url, { headers })
  // }

  /**
   * DELETE (DELETE)
   * @param id
   */
  public deleteMongoDbProject(id: string) {

    let url = this.PROJECTS_URL;
    url += `${id}# chat21-api-nodejs`;
    console.log('DELETE URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });
    return this.http
      .delete(url, options)
      .map((res) => res.json());

  }

  /**
   * READ DETAIL (GET PROJECT BY PROJECT ID)
   * @param id
   */
  public getProjectById(id: string): Observable<Project[]> {
    let url = this.PROJECTS_URL;
    url += `${id}`;
    console.log('!!! GET PROJECT BY ID URL', url);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }

  /**
   * CREATE (POST) THE PROJECT AND AT THE SAME TIME CREATE THE PROJECT-USER IN THE RELATIONAL TABLE
   * @param name
   * @param id_user
   */
  public addMongoDbProject(name: string) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    // , 'id_user': this.currentUserID
    const body = { 'name': name };

    console.log('ADD PROJECT POST REQUEST BODY ', body);

    const url = this.PROJECTS_URL;

    return this.http
      .post(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }







  // ****** CANCEL SUBSCRIPTION ******
  public cancelSubscription() {
    // this.projectID +
    const url = this.SERVER_BASE_PATH + 'modules/payments/stripe/cancelsubscription';

    console.log('cancelSubscription PUT URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'projectid': this.projectID, 'userid': this.user._id };

    console.log('PUT REQUEST BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());

  }


  // ****** UPDATE SUBSCRIPTION ******
  public updatesubscription() {
    // this.projectID +
    const url = this.SERVER_BASE_PATH + 'modules/payments/stripe/updatesubscription';

    console.log('cancelSubscription PUT URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'projectid': this.projectID, 'userid': this.user._id };

    console.log('PUT REQUEST BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());

  }

  // ****** GET SUBSCRIPTION PAYMENTS ******
  public getSubscriptionPayments(subscriptionId: string): Observable<[]> {
    const url = this.SERVER_BASE_PATH + 'modules/payments/stripe/' + subscriptionId;
    console.log('getSubscriptionPayments URL', url);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }

  // ****** GET SUBSCRIPTION by ID ******
  public getSubscriptionById(subscriptionId: string): Observable<[]> {
    const url = this.SERVER_BASE_PATH + 'modules/payments/stripe/stripesubs/' + subscriptionId;
    console.log('getSubscriptionPayments URL', url);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    return this.http
      .get(url, { headers })
      .map((response) => response.json());
  }


  // -----------------------------------------------------------------
  // !!! Maybe not used DOWNGRADE PLAN - todo from put to patch
  // -----------------------------------------------------------------
  public downgradePlanToFree(projectid: string) {
    const url = this.PROJECTS_URL + projectid + '/downgradeplan';
    console.log('downgradePlanToFree URL ', url);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });
    const body = { 'profile.type': 'free', 'profile.name': 'free' };
    console.log('PUT REQUEST BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }


  // -----------------------------------------------------------------
  // Used to update the project name - todo from put to patch
  // -----------------------------------------------------------------
  public updateMongoDbProject(id: string, name: string) {

    let url = this.PROJECTS_URL + id;
    // url += id;
    console.log('PUT URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'name': `${name}` };

    console.log('PUT REQUEST BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }



  // -----------------------------------------------------------------
  // UPDATE PROJECT SETTINGS > Chat limit & Reassignment Timeout
  // -----------------------------------------------------------------
  public updateAdvancedSettings(chatlimit: number, reassignmenttimeout: number, automaticidlechats: number, chat_limit_on: boolean, reassignment_on: boolean, unavailable_status_on: boolean) {

    let url = this.PROJECTS_URL + this.projectID;
    // url += this.projectID;
    console.log('UPDATE ADVANCED SETTINGS - URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = {
      'settings.max_agent_served_chat': chatlimit,
      'settings.reassignment_delay': reassignmenttimeout,
      'settings.automatic_idle_chats': automaticidlechats,
      'settings.chat_limit_on': chat_limit_on,
      'settings.reassignment_on': reassignment_on,
      'settings.automatic_unavailable_status_on': unavailable_status_on,
    }

    console.log('UPDATE ADVANCED SETTINGS - BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }

  // -----------------------------------------------------------------
  // UPDATE PROJECT SETTINGS > AUTO SEND TRANSCRIPT TO REQUESTER  - todo from put to patch
  // -----------------------------------------------------------------
  public updateAutoSendTranscriptToRequester(autosend: boolean) {

    let url = this.PROJECTS_URL + this.projectID;
    // url += this.projectID;
    console.log('UPDATE WIDGET PROJECT - URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'settings.email.autoSendTranscriptToRequester': autosend }

    console.log('UPDATE WIDGET PROJECT - BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }


  // -----------------------------------------------------------------
  // UPDATE WIDGET PROJECT  - todo from put to patch
  // -----------------------------------------------------------------
  public updateWidgetProject(widget_settings: any) {

    let url = this.PROJECTS_URL + this.projectID;
    // url += this.projectID;
    console.log('UPDATE WIDGET PROJECT - URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'widget': widget_settings };

    console.log('UPDATE WIDGET PROJECT - BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }


  // -----------------------------------------------------------------
  // UPDATE OPERATING HOURS - todo from put to patch
  // -----------------------------------------------------------------
  public updateProjectOperatingHours(_activeOperatingHours: boolean, _operatingHours: any): Observable<Project[]> {

    // const url = this.UPDATE_OPERATING_HOURS_URL;
    const url = this.PROJECTS_URL + this.projectID;
    console.log('»»»» »»»» UPDATE PROJECT OPERATING HOURS ', url);
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.TOKEN);

    const options = new RequestOptions({ headers });

    const body = { 'activeOperatingHours': _activeOperatingHours, 'operatingHours': _operatingHours };

    console.log('UPDATE PROJECT OPERATING HOURS PUT REQUEST BODY ', body);


    return this.http
      .put(url, JSON.stringify(body), options)
      .map((response) => response.json());
  }
  /// UPDATE TIMETABLE AND GET AVAILABLE PROJECT USER



  // -----------------------------------------------------------------
  // GENERATE SHARED SECRET
  // -----------------------------------------------------------------
  /* https://api.tiledesk.com/v1/PROJECTID/keys/generate */
  public generateSharedSecret() {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');

    headers.append('Authorization', this.TOKEN);
    const url = this.SERVER_BASE_PATH + this.projectID + '/keys/generate';

    /** ********* FOR TEST  ********* **/
    // headers.append('Authorization', 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnsiZW1haWwiOjEsImZpcnN0bmFtZSI6MSwibGFzdG5hbWUiOjEsInBhc3N3b3JkIjoxLCJlbWFpbHZlcmlmaWVkIjoxLCJpZCI6MX0sImdldHRlcnMiOnt9LCJfaWQiOiI1YWM3NTIxNzg3ZjZiNTAwMTRlMGI1OTIiLCJ3YXNQb3B1bGF0ZWQiOmZhbHNlLCJhY3RpdmVQYXRocyI6eyJwYXRocyI6eyJwYXNzd29yZCI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJlbWFpbHZlcmlmaWVkIjoiaW5pdCIsImxhc3RuYW1lIjoiaW5pdCIsImZpcnN0bmFtZSI6ImluaXQiLCJfaWQiOiJpbml0In0sInN0YXRlcyI6eyJpZ25vcmUiOnt9LCJkZWZhdWx0Ijp7fSwiaW5pdCI6eyJlbWFpbHZlcmlmaWVkIjp0cnVlLCJsYXN0bmFtZSI6dHJ1ZSwiZmlyc3RuYW1lIjp0cnVlLCJwYXNzd29yZCI6dHJ1ZSwiZW1haWwiOnRydWUsIl9pZCI6dHJ1ZX0sIm1vZGlmeSI6e30sInJlcXVpcmUiOnt9fSwic3RhdGVOYW1lcyI6WyJyZXF1aXJlIiwibW9kaWZ5IiwiaW5pdCIsImRlZmF1bHQiLCJpZ25vcmUiXX0sInBhdGhzVG9TY29wZXMiOnt9LCJlbWl0dGVyIjp7ImRvbWFpbiI6bnVsbCwiX2V2ZW50cyI6e30sIl9ldmVudHNDb3VudCI6MCwiX21heExpc3RlbmVycyI6MH0sIiRvcHRpb25zIjp0cnVlfSwiaXNOZXciOmZhbHNlLCJfZG9jIjp7ImVtYWlsdmVyaWZpZWQiOnRydWUsImxhc3RuYW1lIjoiTGFuemlsb3R0byIsImZpcnN0bmFtZSI6Ik5pY29sYSIsInBhc3N3b3JkIjoiJDJhJDEwJDEzZlROSnA3OUx5RVYvdzh6NXRrbmVrc3pYRUtuaWFxZm83TnR2aTZpSHdaQ2ZLRUZKd1kuIiwiZW1haWwiOiJuaWNvbGEubGFuemlsb3R0b0Bmcm9udGllcmUyMS5pdCIsIl9pZCI6IjVhYzc1MjE3ODdmNmI1MDAxNGUwYjU5MiJ9LCIkaW5pdCI6dHJ1ZSwiaWF0IjoxNTQwODE5MTUzfQ.af5nAtSYVmmWzmdgGummY6fQnt2dFTR0lCnrfP0vr6I');
    // const url = 'https://api.tiledesk.com/v1/5b55e806c93dde00143163dd/keys/generate'

    console.log('GENERATE SHARED SECRET URL ', url);
    const body = {};
    const options = new RequestOptions({ headers });
    return this.http
      .post(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }


  // -----------------------------------------------------------------
  // !!! not used - UPDATE GETTING STARTED
  // -----------------------------------------------------------------
  public updateGettingStartedProject(getting_started: any) {

    let url = this.PROJECTS_URL + this.projectID
    // url += this.projectID;
    console.log('UPDATE GETTING-STARTED - URL ', url);

    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-type', 'application/json');
    headers.append('Authorization', this.TOKEN);
    const options = new RequestOptions({ headers });

    const body = { 'gettingStarted': getting_started };

    console.log('UPDATE GETTING-STARTED - BODY ', body);

    return this.http
      .put(url, JSON.stringify(body), options)
      .map((res) => res.json());
  }





}
