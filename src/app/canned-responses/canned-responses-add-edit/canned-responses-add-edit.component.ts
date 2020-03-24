import { Component, OnInit, AfterViewInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CannedResponsesService } from '../../services/canned-responses.service';
import { TranslateService } from '@ngx-translate/core';
import { NotifyService } from '../../core/notify.service';
import { AuthService } from '../../core/auth.service';
@Component({
  selector: 'appdashboard-canned-responses-add-edit',
  templateUrl: './canned-responses-add-edit.component.html',
  styleUrls: ['./canned-responses-add-edit.component.scss']
})
export class CannedResponsesAddEditComponent implements OnInit, AfterViewInit {

  // @Input() displayAddResponseModal: string;
  displayModal_AddEditResponse = 'block'

  @Input() modalMode: string;
  @Input() selectCannedResponseId: string;

  @Output() closeModal = new EventEmitter();
  @Output() hasSavedResponse = new EventEmitter();

  cannedResponseTitle: string;
  cannedResponseMessage: string;
  displayAddcustomizationView = false
  elTextarea: any;
  hovered_value = '';
  createSuccessMsg: string;
  createErrorMsg: string;
  updateSuccessMsg: string;
  updateErrorMsg: string;
  texareaIsEmpty = false;
  showSkeleton = false;
  canned_response_modal_height: any
  addWhiteSpaceBefore: boolean;
  // hideQuickTips = false // not used

  //     { 'field_name': "Website_of_recipient", 'field_value': "$website", "field_desc": "CannedResponses.recipient_website_desc" },
  // { 'field_name': "Email_of_recipient", 'field_value': "$email", "field_desc": "CannedResponses.recipient_email_desc" },
  customFields = [
    { 'field_name': "First_name_of_recipient", 'field_value': "$recipient_name", "field_desc": "CannedResponses.recipient_name_desc" },
    { 'field_name': "First_name_of_agent", 'field_value': "$agent_name", "field_desc": "CannedResponses.agent_name_desc" },
    
  ]

  constructor(
    public cannedResponsesService: CannedResponsesService,
    public translate: TranslateService,
    private notify: NotifyService,
    private auth: AuthService
  ) { }

  // 

  ngOnInit() {
    console.log('CANNED-RES-CREATE.COMP - modalMode ', this.modalMode);
    console.log('CANNED-RES-CREATE.COMP - selectCannedResponseId ', this.selectCannedResponseId);
    
    this.auth.checkRoleForCurrentProject();
    
    if (this.modalMode === 'edit') {

      this.showSkeleton = true

      this.getCannedResponseById()
    }

    this.translateNotificationMsgs();
    this.getWindowInnerHeight();
  }

  getWindowInnerHeight() {
    //  const  actualHeight = window.innerHeight;
    const actualWidth = window.innerWidth;
    if (actualWidth <= 991) {
      // this.hideQuickTips = true
      const elemMainContent = <HTMLElement>document.querySelector('.main-content');
      const elemMainContentHeight = elemMainContent.clientHeight;
      console.log('CANNED-RES  elemMainContentHeight', elemMainContentHeight)
      this.canned_response_modal_height = elemMainContent.clientHeight + 70 + 'px'
      // this.mobile_v = true;
    } else {
      // this.hideQuickTips = false;
    }
  }

  ngAfterViewInit() {
    this.getTextArea();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: any) {

    const newInnerWidth = event.target.innerWidth;
    // console.log('CANNED-RES  newInnerWidth', newInnerWidth);

    if (newInnerWidth <= 991) {
      // this.hideQuickTips = true
      const elemMainContent = <HTMLElement>document.querySelector('.main-content');

      this.canned_response_modal_height = elemMainContent.clientHeight + 70 + 'px'

      // this.mobile_v = true;
    } else {
      // this.hideQuickTips = false;
    }

  }


  translateNotificationMsgs() {
    this.translate.get('CannedResponses.NotificationMsgs')
      .subscribe((translation: any) => {
        console.log('CANNED-RES  translateNotificationMsgs text', translation)
        this.createSuccessMsg = translation.CreateCannedResSuccess;
        this.createErrorMsg = translation.CreateCannedResError;
        this.updateSuccessMsg = translation.UpdateCannedResSuccess;
        this.updateErrorMsg = translation.UpdateCannedResError;
      });
  }

  getCannedResponseById() {
    this.cannedResponsesService.getCannedResponseById(this.selectCannedResponseId)
      .subscribe((response: any) => {
        console.log('CANNED-RES - GET CANNED RES BY ID - RES ', response);

        if (response) {
          this.cannedResponseMessage = response.text
          this.cannedResponseTitle = response.title
        }

      }, (error) => {
        console.log('CANNED-RES - GET CANNED RES BY ID - ERROR  ', error);
        this.showSkeleton = false
      }, () => {
        console.log('CANNED-RES - GET CANNED RES BY ID * COMPLETE *');
        this.showSkeleton = false

      });
  }

  getTextArea() {
    this.elTextarea = <HTMLElement>document.querySelector('.canned-response-texarea');
    console.log('CANNED-RES-CREATE.COMP - GET TEXT AREA - elTextarea ', this.elTextarea);
  }

  insertCustomField(customfieldValue: string) {
    
    if (this.elTextarea) {
      this.insertAtCursor(this.elTextarea, customfieldValue)
      this.displayAddcustomizationView = false;
    }
  }

  insertAtCursor(myField, myValue) {
    console.log('CANNED-RES-CREATE.COMP - insertAtCursor - myValue ', myValue );
     
    if (this.addWhiteSpaceBefore === true) {
      myValue = ' ' + myValue;
      console.log('CANNED-RES-CREATE.COMP - GET TEXT AREA - QUI ENTRO myValue ', myValue );
    }
   
    //IE support
    if (myField.selection) {
      myField.focus();
      let sel = myField.selection.createRange();
      sel.text = myValue;
      // this.cannedResponseMessage = sel.text;
    }
    //MOZILLA and others
    else if (myField.selectionStart || myField.selectionStart == '0') {
      var startPos = myField.selectionStart;
      console.log('CANNED-RES-CREATE.COMP - insertAtCursor - startPos ', startPos);
      
      var endPos = myField.selectionEnd;
      console.log('CANNED-RES-CREATE.COMP - insertAtCursor - endPos ', endPos);
      
      myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
  
      // place cursor at end of text in text input element
      myField.focus();
      var val = myField.value; //store the value of the element
      myField.value = ''; //clear the value of the element
      myField.value = val + ' '; //set that value back. 
  
      this.cannedResponseMessage = myField.value;

      this.texareaIsEmpty = false;
      // myField.select();
    } else {
      myField.value += myValue;
      this.cannedResponseMessage = myField.value;
    }
  }

  cannedResponseMessageChanged($event) {
    console.log('CANNED-RES-CREATE.COMP - ON MSG CHANGED ', $event);
    if ($event && $event.length > 0) {
      this.texareaIsEmpty = false;
    } else {
      // this.texareaIsEmpty = true;
    }

    if(/\s$/.test($event)) {
    
      console.log('CANNED-RES-CREATE.COMP - ON MSG CHANGED - string contains space at last');
      this.addWhiteSpaceBefore = false;
   } else {
     
      console.log('CANNED-RES-CREATE.COMP - ON MSG CHANGED - string does not contain space at last');

      // IS USED TO ADD A WHITE SPACE TO THE 'PERSONALIZATION' VALUE IF THE STRING DOES NOT CONTAIN SPACE AT LAST
      this.addWhiteSpaceBefore = true;
   }       

  }

  createResponse() {
    console.log('CANNED-RES-CREATE.COMP - CREATE CANNED RESP - MSG ', this.cannedResponseMessage);
    console.log('CANNED-RES-CREATE.COMP - CREATE CANNED RESP - TITLE ', this.cannedResponseTitle);

    if (this.cannedResponseMessage && this.cannedResponseMessage.length > 0) {
      this.texareaIsEmpty = false;

      let responseTitle = 'Untitled'
      if (this.cannedResponseTitle) {
        responseTitle = this.cannedResponseTitle
      }

      this.cannedResponsesService.createCannedResponse(this.cannedResponseMessage.trim(), responseTitle)
        .subscribe((responses: any) => {
          console.log('CANNED-RES-CREATE.COMP - CREATE CANNED RESP - RES ', responses);

        }, (error) => {
          console.log('CANNED-RES-CREATE.COMP - CREATE CANNED RESP - ERROR  ', error);
          this.notify.showWidgetStyleUpdateNotification(this.createErrorMsg, 4, 'report_problem');
        }, () => {
          console.log('CANNED-RES-CREATE.COMP - CREATE CANNED RESP * COMPLETE *');
          this.notify.showWidgetStyleUpdateNotification(this.createSuccessMsg, 2, 'done');
          this.hasSavedResponse.emit();
          this.closeModal.emit();
        });
    } else {
      this.texareaIsEmpty = true;
      this.elTextarea.focus()

    }
  }


  editResponse() {
    let responseTitle = 'Untitled'
    if (this.cannedResponseTitle) {
      responseTitle = this.cannedResponseTitle
    }

    this.cannedResponsesService.updateCannedResponse(this.cannedResponseMessage, this.selectCannedResponseId, responseTitle)
      .subscribe((responses: any) => {
        console.log('CANNED-RES-CREATE.COMP - EDIT CANNED RESP - RES ', responses);

      }, (error) => {
        console.log('CANNED-RES-CREATE.COMP - EDIT CANNED RESP - ERROR  ', error);
        this.notify.showWidgetStyleUpdateNotification(this.updateErrorMsg, 4, 'report_problem');
      }, () => {
        console.log('CANNED-RES-CREATE.COMP - EDIT CANNED RESP * COMPLETE *');
        this.notify.showWidgetStyleUpdateNotification(this.updateSuccessMsg, 2, 'done');
        this.hasSavedResponse.emit();
        this.closeModal.emit();
      });
  }

  hasClickedAddCustomization() {
    
    this.getTextArea();
    this.displayAddcustomizationView = true;
    this.hovered_value = '';
    console.log('CANNED-RES - mouseEnter hasClickedAddCustomization hovered_value.length ', this.hovered_value.length);
  }

  closeAddcustomizationView() {
    this.displayAddcustomizationView = false;
  }

  mouseEnter(fileValue: string) {
    // console.log('CANNED-RES - mouseEnter fileValue ', fileValue);
    this.hovered_value = fileValue
  }

  mouseLeave() {
    // console.log('CANNED-RES - mouseLeave ');
    this.hovered_value = ''
  }


  closeModal_AddEditResponse() {
    this.closeModal.emit();
  }


}
