import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { AttendanceService } from 'app/utils/services/attendance/attendance.service';
import { LoginService } from 'app/utils/services/login/login.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { VisitorsAttendanceComponent } from '../visitors-attendance/visitors-attendance.component';

@Component({
  selector: 'app-activity-attendance',
  templateUrl: './activity-attendance.component.html',
  styleUrls: ['./activity-attendance.component.scss']
})
export class ActivityAttendanceComponent implements OnInit {

  @ViewChild('visitorsAttendance') visitorsAttendance: VisitorsAttendanceComponent;
  roleEditPermission = true;
  allActivityDDList = [];
  selectedActivityCode = [];
  roleVisitorsEditPermission: Boolean = true;
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  attendanceDDList = [];
  attendanceColumDefs =
    [
      { headerName: 'UID Number', field: 'uidNo', width: 220, resizable: true, filter: true, sortable: true },
      { headerName: 'Name', field: 'name', width: 320, resizable: true, filter: true, sortable: true },
      { headerName: 'Current Status', field: 'iniJigStatus', resizable: true, filter: true, sortable: true },
      { headerName: 'Family Code', field: 'familyCode', resizable: true, filter: true, sortable: true },
      { headerName: 'Select Person', checkboxSelection: true, filter: true, sortable: true,
       headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true }
      // , field: 'fieldName',
      // cellRenderer: function(params) {
      //     const input = document.createElement('input');
      //     input.type = 'checkbox';
      //     input.checked = params.value;
      //     input.addEventListener('click', function (event) {
      //         params.value = ! params.value;
      //         params.node.data.fieldName = params.value;
      //     });
      //     return input;
      // }
    ];
  selectedRow = [];
  currentActiveTab: Boolean = true;
  visitorsRowFilled: Boolean = false;
  isOpenNewWindow: Boolean = true;
  attendDate = '';
  dropdownSettings = {};
  dropdownList = [];
  @HostBinding('style.height') height;
  constructor(private attendanceService: AttendanceService, private spinner: NgxSpinnerService, private utilsService: UtilsService,
    private loginService: LoginService, public activeModal: NgbModal, private alertService: ToastrService) { }
  onResize(event) {
    this.height = (event.target.innerHeight - 275);
  }
  ngOnInit() {
    this.height = this.height ? this.height : (window.innerHeight - 305);
    const attendanceRoleList = this.loginService.getUserRoles()
      .some(function (res: any) { return (res.roleId === 4 && res.accessType === 'Write'); });
    if (attendanceRoleList) {
      this.roleEditPermission = false;
    }

    const attendanceVisitorRoleList = this.loginService.getUserRoles()
      .some(function (res: any) { return (res.roleId === 5 && res.accessType === 'Write'); });
    if (attendanceVisitorRoleList) {
      this.roleVisitorsEditPermission = false;
    }
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'actId',
      textField: 'actName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getPeopleData();
    this.getAllActivityLists();
  }

  onItemSelect(event) {
    console.log(event, this.selectedActivityCode);
  }
  onSelectAll(event) {
    console.log(event);
  }
  getAllActivityLists() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.getAllActivityLists().subscribe(
      (response) => {
        if (response.data) {
          this.allActivityDDList = response.data;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
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

  getPeopleData() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.getPeopleData().subscribe(
      (response) => {
        if (response.data) {
          // response.peopleList.forEach(element => {
          //   element.fieldName = false;
          // });
          this.attendanceDDList = response.data;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Something went wrong. Please contact administrator.',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
      },
      (error) => {
        setTimeout(() => { this.spinner.hide(); }, 1000);
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  tabChanges(event) {
    if (event.nextId === 'ngb-tab-1') {
      this.currentActiveTab = false;
    }
    if (event.nextId === 'ngb-tab-0') {
      this.currentActiveTab = true;
    }
  }

  onRowSelection(event) {
    // event.api.getSelectedRows().forEach((_ele, i) => {
    //   _ele.fieldName = true;
    //   this.attendanceDDList[i].fieldName = true;
    // });
    this.selectedRow = event.api.getSelectedRows();
  }

  goForResetAllRecords() {
    if (this.currentActiveTab) {
      this.resetAll();
    } else {
      this.selectedActivityCode = [];
      this.attendDate = '';
      this.visitorsAttendance.clearPage();
    }
  }

  saveSelectedAttendance() {
    if (!this.roleEditPermission) {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      const dataToSave = {
        activityDate: this.utilsService.formatDate(this.attendDate),
        activityCode: this.selectedActivityCode[0].actId,
        rollNoList: this.selectedRow.map(p => p.rollNo)
      };
      const s = [];
      this.attendanceService.saveSelectedAttendance(s).subscribe(
        (response) => {
          if (response) {
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Attendance Saved Successfully',
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Redirecting Please Wait...',
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
            setTimeout(() => {
              this.spinner.hide();
              window.open('/#/savedAttendance/' + dataToSave.activityCode + '/' + dataToSave.activityDate, '_blank');
            }, 1000);
            this.resetAll();
          } else {
            setTimeout(() => { this.spinner.hide(); }, 1000);
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
        },
        (error) => {
          setTimeout(() => { this.spinner.hide(); }, 1000);
          const errMsg = this.utilsService.errorServiceHandler(error);
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
      );
    }
  }

  goForAttendanceSave() {
    if (this.selectedRow.length > 0) {
      console.log(this.selectedRow.filter(s => s.fieldName));
      this.saveSelectedAttendance();
      this.isOpenNewWindow = false;
    }
    if (this.visitorsRowFilled) {
      this.visitorsAttendance.saveVisitorsAttendance(this.selectedActivityCode[0].actId,
        this.utilsService.formatDate(this.attendDate), this.isOpenNewWindow);
    }
    this.isOpenNewWindow = true;
  }

  resetAll() {
    this.selectedActivityCode = [];
    this.attendDate = '';
    this.selectedRow = [];
    this.attendanceDDList = [];
    this.getPeopleData();
  }

  dataFilledInVisitors(event) {
    this.visitorsRowFilled = event;
  }

  openProcessResetConfirmModal(event) {
    this.activeModal.open(event);
  }

  openProcessConfirmModal(event) {
    this.activeModal.open(event);
  }

}
