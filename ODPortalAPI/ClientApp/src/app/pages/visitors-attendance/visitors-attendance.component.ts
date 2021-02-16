import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { AttendanceService } from 'app/utils/services/attendance/attendance.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visitors-attendance',
  templateUrl: './visitors-attendance.component.html',
  styleUrls: ['./visitors-attendance.component.scss']
})
export class VisitorsAttendanceComponent implements OnInit {

  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  attendanceDDList = [];
  selectedRow = [];
  roleEditPermission = true;
  allActivityDDList = [];
  visitorName = '';
  branchName = '';
  gender = 'M';
  isInitiated = 'No';
  age: any;
  mobileNum = '';
  genderArray = ['M', 'F'];
  isInitiatedArray = ['Yes', 'No'];
  selectedRowData;
  attendanceColumDefs = [
    {
      headerName: 'Visitor Name', field: 'visitorName',
      width: 220, resizable: true,
      editable: true
    }, // cellStyle: { 'background-color': '#6fe4e8' }
    {
      headerName: 'Visitor Branch', field: 'branchName',
      width: 280, resizable: true,
      editable: true
    },
    {
      headerName: 'Gender', field: 'gender',
      resizable: true,
      editable: true
    },
    {
      headerName: 'Initiated?', field: 'isInitiated',
      resizable: true,
      editable: true
    }
  ];
  visitorsIsOpenFlag = false;
  panelArray = ['config-panel-one', 'config-panel-two'];
  @Output() dataFilledInVisitors = new EventEmitter<Boolean>();
  @HostBinding('style.height') height;

  constructor(config: NgbAccordionConfig, private spinner: NgxSpinnerService, private attendanceService: AttendanceService,
    private utilsService: UtilsService, private alertService: ToastrService) {
    config.closeOthers = false;
    config.type = 'info';
  }
  onResize(event) {
    this.height = (event.target.innerHeight - 265);
  }
  ngOnInit() {
    this.height = this.height ? this.height : (window.innerHeight - 420);
  }

  onSelectedRowData(event) {
    this.selectedRowData = event.api.getSelectedRows();
  }

  deleteSelectedRow() {
    const selecteRec = JSON.parse(JSON.stringify(this.selectedRowData));
    let allRec = JSON.parse(JSON.stringify(this.attendanceDDList));

    for (let i = 0; i < allRec.length; i++) {
      if (selecteRec[0].visitorName === allRec[i].visitorName && selecteRec[0].branchName === allRec[i].branchName) {
        allRec.splice(i, 1);
      }
    }
    this.attendanceDDList = JSON.parse(JSON.stringify(allRec));
    this.selectedRowData = '';
    if (allRec.length === 0) {
      this.dataFilledInVisitors.emit(false);
    }
  }

  resetForm() {
    this.visitorName = null;
    this.branchName = null;
    this.mobileNum = null;
    this.age = null;
  }

  addRowAfterFilling() {
    let goForSave = true;
    let agGridRowData = JSON.parse(JSON.stringify(this.attendanceDDList));
    const dataToPush = {
      visitorName: this.visitorName, branchName: this.branchName,
      gender: this.gender, isInitiated: this.isInitiated, age: this.age
    };
    if (!dataToPush.visitorName) {
        goForSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Name is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (dataToPush.visitorName) {
      if (!dataToPush.visitorName.trim()) {
        goForSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Name is invalid',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (!dataToPush.branchName) {
      goForSave = false;
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Branch Name is required',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
    if (dataToPush.branchName) {
      if (!dataToPush.branchName.trim()) {
        goForSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Branch Name is invalid',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }
    if (dataToPush.age) {
      if (dataToPush.age < 0) {
        goForSave = false;
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Age is invalid',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    }

    if (goForSave) {
      this.resetForm();
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Record added successfully',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
      agGridRowData.push(dataToPush);
      this.attendanceDDList = JSON.parse(JSON.stringify(agGridRowData));
      this.visitorsIsOpenFlag = true;
      this.dataFilledInVisitors.emit(true);
    }
  }

  clearPage() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceDDList = [];
    this.resetForm();
    setTimeout(() => { this.spinner.hide(); }, 1000);
  }
  saveVisitorsAttendance(activityCode, activityDate, openNewWindow) {
    let passToSave = true;
    const postData = [];
    if (this.attendanceDDList.length === 0) {
      passToSave = false;
    }
    for (let i = 0; i < this.attendanceDDList.length; i++) {
      if (this.attendanceDDList[i].gender) {
        if (!(this.attendanceDDList[i].gender.toLowerCase().trim() === 'm' ||
               this.attendanceDDList[i].gender.toLowerCase().trim() === 'f')) {
          passToSave = false;
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Incorrect value entered for Gender',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          break;
        }
      }
      if (this.attendanceDDList[i].isInitiated) {
        if (!(this.attendanceDDList[i].isInitiated.toLowerCase().trim() === 'yes' ||
               this.attendanceDDList[i].isInitiated.toLowerCase().trim() === 'no')) {
          passToSave = false;
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Incorrect value entered for Initiated',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          break;
        }
      }
      postData.push({visitorName : this.attendanceDDList[i].visitorName,
        branchName: this.attendanceDDList[i].branchName, gender: this.attendanceDDList[i].gender,
         isInitiated: this.attendanceDDList[i].isInitiated, activityCode: activityCode,
         activityDate: activityDate, age: this.attendanceDDList[i].age});
    }
    if (passToSave) {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.attendanceService.saveVisitorsAttendance(postData).subscribe(
        (response) => {
          if (response) {
            this.clearPage();
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Attendance Saved successfully',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
            if (openNewWindow) {
              window.open('/#/savedAttendance/' + activityCode + '/' + this.utilsService.formatDate(activityDate), '_blank');
            }
          } else {
            // tslint:disable-next-line: max-line-length
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
          setTimeout(() => { this.spinner.hide(); }, 1000);
        },
        (error) => {
          // set loading to false on error
          this.spinner.hide();
          const errMsg = this.utilsService.errorServiceHandler(error);
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
      );
    }
  }

}
