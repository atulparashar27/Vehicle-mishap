import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbAccordionConfig, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'app/utils/services/login/login.service';
import { ProfileService } from 'app/utils/services/profile/profile.service';
import { UtilsService } from 'app/utils/services/util.service';
import { CONSTANTS } from 'app/utils/Constants';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  moduleId: module.id,
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  maritalArray = ['Single', 'Married', 'Widowed', 'Divorced', 'Other'];
  nationalityArray = ['Indian', 'Other'];
  titleArray = ['Mr.', 'Ms.', 'Mrs.', 'Dr.', 'Prof.', 'Other'];
  disablePersonalEditBtn = true;
  hideShowPersonalBtn = false;
  hideShowBranchBtn = false;
  profileList: any = [];
  contactInfoList: any = [];
  companyInfoList: any = [];
  qualificationInfoList: any = [];
  personBrInfoList: any = [];
  uidNum: any = {};
  rollNo = '';
  passToSave = false;
  isClicked = 0;
  textMsg = '';
  widthConfigure = 'col-md-8';
  username = '';
  branchDetailsBtnFlag = false;
  @ViewChild('processConfirmModal', { static: false }) processConfirmModal: NgbModal;
  @Input()
  public set passedFamilyDetails([...event]) {
    this.callGetProfile(event[0], event[1]);
  }
  constructor(config: NgbAccordionConfig, public utilsService: UtilsService, public alertService: ToastrService,
    public profileService: ProfileService, private spinner: NgxSpinnerService,
    private loginService: LoginService, private route: Router, public activeModal: NgbModal, modalConfig: NgbModalConfig) {
    config.closeOthers = true;
    config.type = 'info';
    modalConfig.backdrop = 'static';
    modalConfig.keyboard = false;
  }

  ngOnInit() {
    if (this.route.url === '/profile') {
      this.hideShowPersonalBtn = true;
      this.hideShowBranchBtn = true;
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.uidNum = this.loginService.getUserloggedIn().uidNo;
      this.rollNo = this.loginService.getUserloggedIn().rollNo;
      this.username = this.loginService.getUserloggedIn().userName;
      setTimeout(() => {
        this.getProfileData(this.uidNum, this.rollNo);
      }, 500);
    }
  }

  getProfileData(uidNo, rollNo) {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.profileService.getProfileDataList(uidNo, rollNo).subscribe(
      (response) => {
        if (response) {
          this.profileList = response.data.profileList;
          if (this.profileList.dateOfBirth) {
            // this.profileList.dateOfBirth = this.profileList.dateOfBirth.split('-').reverse().join('-');
            this.profileList.dateOfBirth = new Date(this.profileList.dateOfBirth);
          }
          this.profileList.title = this.profileList.title || this.titleArray[0];
          this.contactInfoList = response.data.contactInfo;
          this.companyInfoList = response.data.companyInfo;
          this.qualificationInfoList = response.data.qualificationInfo;
          this.personBrInfoList = response.data.personBrInfo;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
      },
      (error) => {
        // set loading to false on error
        setTimeout(() => { this.spinner.hide(); }, 1000);
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  public callGetProfile(parentUidNo, passRollNo) {
    if (parentUidNo || passRollNo) {
      this.uidNum = parentUidNo;
      this.rollNo = passRollNo;
      this.getProfileData(parentUidNo, passRollNo);
    }
  }

  resetAll() {
    this.getProfileData(this.uidNum, this.rollNo);
    this.disablePersonalEditBtn = true;
  }

  accordionChangeOrOpen(event) {
    this.disablePersonalEditBtn = true;
  }

  editForm() {
    this.disablePersonalEditBtn = false;
  }

  openProfileDetailsPopUp(content, value) {
    if (value === 1) {
      this.textMsg = 'Personal Details';
    }
    if (value === 2) {
      this.textMsg = 'Contact Details';
    }
    if (value === 3) {
      this.textMsg = 'Occupation Details';
    }
    if (value === 4) {
      this.textMsg = 'Qualification Details';
    }
    if (value === 5) {
      this.textMsg = 'Branch Details';
    }
    this.isClicked = value;
    this.activeModal.open(content);
  }

  saveData() {
    if (this.isClicked === 1) {
      this.savePersonalDetails();
    }
    if (this.isClicked === 2) {
      this.saveContactDetails();
    }
    if (this.isClicked === 3) {
      this.saveCompanyDetails();
    }
    if (this.isClicked === 4) {
      this.saveQualificationDetails();
    }
    if (this.isClicked === 5) {
      console.log('Branch details');
    }
    this.disablePersonalEditBtn = true;
  }


  savePersonalDetails() {
    this.passToSave = true;
    const todayDate = new Date();
    if (!this.profileList.fullName || !this.profileList.fullName.trim()) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Name cannot be Blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (!this.profileList.maritalStatus) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Marital Status cannot be Blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (!this.profileList.dateOfBirth) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Date of birth cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (this.profileList.dateOfBirth) {
      const invalidDate =  this.profileList.dateOfBirth instanceof Date && !isNaN(this.profileList.dateOfBirth);
      // const invalidDate = new Date(this.profileList.dateOfBirth) instanceof Date;
      if (!invalidDate) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Invalid Date of birth format',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      } else if (todayDate < this.profileList.dateOfBirth) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Date of birth cannot be in future',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.profileList.aadharNo) {
      const lenAadhar = this.profileList.aadharNo.toString().length;
      if (lenAadhar !== 16) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Incorrect Aadhar Number',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.profileList.panNo) {
      const lenPAN = this.profileList.panNo.toString().length;
      if (lenPAN > 10) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Incorrect PAN Number',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (!this.profileList.caste) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Caste cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (!this.profileList.nationality) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Nationality cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (this.passToSave) {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      const dataToPush = { ...this.profileList };
      dataToPush.dateOfBirth = this.utilsService.formatDate(dataToPush.dateOfBirth);
      this.profileService.savePersonalDetails(dataToPush, this.uidNum).subscribe(
        (response) => {
          if (response.success) {
            this.disablePersonalEditBtn = true;
            this.resetAll();
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Personal details saved successfully',
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
          } else {
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.errMessage,
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
          setTimeout(() => { this.spinner.hide(); }, 1000);
        },
        (error) => {
          // set loading to false on error
          setTimeout(() => { this.spinner.hide(); }, 1000);
          const errMsg = this.utilsService.errorServiceHandler(error);
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
      );
    }
  }

  saveContactDetails() {
    this.passToSave = true;
    if (!this.contactInfoList.mobileNo1) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Mobile Number is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (this.contactInfoList.mobileNo1) {
      if (this.contactInfoList.mobileNo1.toString().length !== 10) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Mobile Number is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.contactInfoList.emergencyContactNo) {
      if (this.contactInfoList.emergencyContactNo.toString().length !== 10) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Emergency Number is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.contactInfoList.mobileNo2) {
      if (this.contactInfoList.mobileNo2.toString().length !== 10) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Mobile Number 2 is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (!this.contactInfoList.residenceAddr) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Address is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (!this.contactInfoList.city) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'City is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (!this.contactInfoList.pincode) {
      this.passToSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Pin Code is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (this.contactInfoList.pincode) {
      if (this.contactInfoList.pincode.toString().length !== 6) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Pin Code is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }

    if (this.contactInfoList.email1) {
      // tslint:disable-next-line: max-line-length
      const asd = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const isValid = asd.test(this.contactInfoList.email1);
      if (!isValid) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Email 1 is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.contactInfoList.email2) {
      // tslint:disable-next-line: max-line-length
      const asd = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      const isValid = asd.test(this.contactInfoList.email2);
      if (!isValid) {
        this.passToSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Email 2 is invalid',
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (this.passToSave) {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.profileService.saveContactDetails(this.contactInfoList, this.uidNum).subscribe(
        (response) => {
          if (response.success) {
            this.disablePersonalEditBtn = true;
            this.resetAll();
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Contact details saved successfully',
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
          } else {
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.errMessage,
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
          setTimeout(() => { this.spinner.hide(); }, 1000);
        },
        (error) => {
          // set loading to false on error
          setTimeout(() => { this.spinner.hide(); }, 1000);
          const errMsg = this.utilsService.errorServiceHandler(error);
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
      );
    }
  }

  saveCompanyDetails() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.profileService.saveCompanyDetails(this.companyInfoList, this.uidNum).subscribe(
      (response) => {
        if (response.success) {
          this.disablePersonalEditBtn = true;
          this.resetAll();
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Occupation details saved successfully',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
        } else {
          // tslint:disable-next-line: max-line-length
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.errMessage, '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 1000);
      },
      (error) => {
        // set loading to false on error
        setTimeout(() => { this.spinner.hide(); }, 1000);
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  saveQualificationDetails() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.profileService.saveQualificationDetails(this.qualificationInfoList, this.uidNum).subscribe(
      (response) => {
        if (response.success) {
          this.disablePersonalEditBtn = true;
          this.resetAll();
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Occupation details saved successfully',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
        } else {
          // tslint:disable-next-line: max-line-length
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.errMessage, '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 1000);
      },
      (error) => {
        // set loading to false on error
        setTimeout(() => { this.spinner.hide(); }, 1000);
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg, '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }
}
