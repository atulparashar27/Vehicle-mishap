import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { AttendanceService } from 'app/utils/services/attendance/attendance.service';
import { LoginService } from 'app/utils/services/login/login.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-people-attendance',
  templateUrl: './update-people-attendance.component.html',
  styleUrls: ['./update-people-attendance.component.scss']
})
export class UpdatePeopleAttendanceComponent implements OnInit {

  roleEditPermission = true;
  allActivityDDList = [];
  selectedActivityCode = [];
  roleVisitorsEditPermission: Boolean = true;
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  attendanceDDList = [];
  attendDate = '';
  dropdownSettings = {};
  dropdownList = [];
  futureDateDisabled: Date = new Date();
  attendanceRowData = [];
  attendanceColumDefs =
    [
      { headerName: 'UID Number', field: 'uidNo', width: 220, resizable: true, filter: true, sortable: true },
      { headerName: 'Name', field: 'name', width: 320, resizable: true, filter: true, sortable: true },
      { headerName: 'Current Status', field: 'iniJigStatus', resizable: true, filter: true, sortable: true },
      {
        headerName: 'Select Person', checkboxSelection: true, filter: true, sortable: true,
        headerCheckboxSelection: true, headerCheckboxSelectionFilteredOnly: true
      }
    ];
  selectedRow = [];
  allActivityDDList2 = [];
  selectedActivityCode2 = [];
  @HostBinding('style.height') height;

  constructor(private attendanceService: AttendanceService, private spinner: NgxSpinnerService, private utilsService: UtilsService,
    private loginService: LoginService, public activeModal: NgbModal, private alertService: ToastrService) { }

  onResize(event) {
    this.height = (event.target.innerHeight - 175);
  }

  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'actId',
      textField: 'actName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
    this.getAllActivityLists();
  }

  getAllActivityLists() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.getAllActivityLists().subscribe(
      (response) => {
        if (response.data) {
          this.allActivityDDList = response.data;
          this.allActivityDDList2 = JSON.parse(JSON.stringify(response.data));
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

  getSavedAttendance() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.getActivityAttendance('02', '2021-05-09').subscribe(
      (response) => {
        if (response.data) {
          this.attendanceRowData = response.data.savedAttendancePeopleModals;
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

  onRowSelection(event) {
    this.selectedRow = event.api.getSelectedRows();
  }

  clearSelection() {
    this.attendanceRowData = [];
    this.attendDate = '';
    this.selectedActivityCode = [];
  }

  openModal(modal) {
    this.activeModal.open(modal, { size: 'lg' });
  }
}
