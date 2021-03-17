import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { CONSTANTS } from 'app/utils/Constants';
import { ReportsService } from 'app/utils/services/reports/reports.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-branch-people-attendance',
  templateUrl: './branch-people-attendance.component.html',
  styleUrls: ['./branch-people-attendance.component.css']
})
export class BranchPeopleAttendanceComponent implements OnInit {

  attendDateRange = '';
  dropdownSettings = {};
  allActivityDDList = [];
  selectedActivityCode = [];
  branchTitle = 'All';
  branchTitleArray = ['All', 'Initiated', 'Jigyasus', 'Children', 'Sant Su'];
  startAge = 0;
  endAge = 90;
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  branchPeopleAttendance = [];
  branchPeopleDetailedAttendance = [];
  branchPeopleAttendanceColumDefs = [
    { headerName: 'Activity Code', field: 'singleActivityCode', width: 120, resizable: true, filter: true, sortable: true },
    { headerName: 'Activity Name', field: 'activityName', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'UID Number', field: 'uidNo', width: 120, resizable: true, filter: true, sortable: true },
    { headerName: 'Roll Number', field: 'rollNo', width: 120, resizable: true, filter: true, sortable: true },
    { headerName: 'Name', field: 'name', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Branch Title', field: 'brTitle', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Attendance Date', field: 'attendanceDate', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Mobile Number', field: 'mobileNum', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Attendance Count', field: 'attendanceCount', width: 150, resizable: true, filter: true, sortable: true }
  ];
  branchPeopleDetailedAttendanceColumDefs = [
    { headerName: 'Activity Name', field: 'activityName', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'UID Number', field: 'uidNo', width: 120, resizable: true, filter: true, sortable: true },
    { headerName: 'Roll Number', field: 'rollNo', width: 120, resizable: true, filter: true, sortable: true },
    { headerName: 'Name', field: 'name', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Branch Title', field: 'brTitle', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Attendance Date', field: 'attendanceDate', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Attendance Count', field: 'attendanceCount', width: 150, resizable: true, filter: true, sortable: true },
  ];
  gridApi: GridOptions;
  page = 1;
  pageSize = 0;
  @HostBinding('style.height') height;
  constructor(private reportService: ReportsService, private spinner: NgxSpinnerService,
    private alertService: ToastrService, private utilsService: UtilsService, private activeModal: NgbModal) { }
  onResize(event) {
      this.height = (event.target.innerHeight - 275);
  }
  ngOnInit(): void {
    this.height = this.height ? this.height : (window.innerHeight - 305);
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'actId',
      textField: 'actName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.getAllActivityLists();
  }

  getAllActivityLists() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.reportService.getAllActivityLists().subscribe(
      (response) => {
        if (response.data) {
          // const dataToPush = [];
          // dataToPush.push({actId: 'All', actName: 'All'});
          // for (let i = 0; i < response.data.length; i++) {
          //   dataToPush.push(response.data[i]);
          // }
          this.allActivityDDList = response.data;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
      },
      (error) => {
        this.spinner.hide();
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  getBranchPeopleAttendance() {
    const dataToPush = {
      activityCode: this.selectedActivityCode.map(s => s.actId),
      startDate: this.utilsService.formatDate(this.attendDateRange[0]),
      endDate: this.utilsService.formatDate(this.attendDateRange[1]),
      brTitle: this.branchTitle,
      startAge: this.startAge,
      endAge: this.endAge,
      uidNo: null
    };
    let count = 1;
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.reportService.getBranchPeopleAttendance(dataToPush, this.page).subscribe(
      (response) => {
        if (response.success) {
          console.log(response);
          response.data.branchPeopleAttendance = response.data.branchPeopleAttendance.sort((a, b) => (a.activityName > b.activityName)
          ? 1 : (b.activityName > a.activityName) ? -1 : 0);
          // const finalPush = [];
          // const mainWindowObj = response.data.branchPeopleAttendance.map(s => ({ activityName: s.activityName, uidNo: s.uidNo,
          //    rollNo: s.rollNo, name: s.name, brTitle: s.brTitle, singleActivityCode: s.singleActivityCode }));
          //    for (let i = 0; i < mainWindowObj.length; i++) {
          //     if (mainWindowObj[i + 1] && mainWindowObj[i].name === mainWindowObj[i + 1].name &&
          //         mainWindowObj[i].activityName === mainWindowObj[i + 1].activityName) {
          //       count = count + 1;
          //     } else {
          //         finalPush.push(
          //         {
          //           activityName: mainWindowObj[i].activityName,
          //           uidNo: mainWindowObj[i].uidNo,
          //           rollNo: mainWindowObj[i].rollNo,
          //           name: mainWindowObj[i].name,
          //           brTitle: mainWindowObj[i].brTitle,
          //           attendanceCount: count,
          //           singleActivityCode: mainWindowObj[i].singleActivityCode
          //         });
          //         count = 1;
          //     }
          // }
          response.data.branchPeopleAttendance.forEach(element => {
            element.attendanceDate = this.utilsService.formatDateDDMMYYY(element.attendanceDate)
          });
          this.branchPeopleAttendance = response.data.branchPeopleAttendance;
          this.pageSize = (Math.ceil(response.data.count / 500)) * 10;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
      },
      (error) => {
        this.spinner.hide();
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  clearAll() {
    this.attendDateRange = '';
    this.branchPeopleAttendance = [];
    this.selectedActivityCode = [];
  }

  viewDetailedAttendance(event, modal) {
    this.getDetailedUserAttendance(event.data.uidNo, event.data.rollNo, event.data.singleActivityCode);
    this.activeModal.open(modal, { size: 'xl' });
  }

  getDetailedUserAttendance(uidNo, rollNo, activityName) {
    const dataToPush = {
      // activityCode: this.selectedActivityCode[0].actId,
      startDate: this.utilsService.formatDate(this.attendDateRange[0]),
      endDate: this.utilsService.formatDate(this.attendDateRange[1]),
      brTitle: this.branchTitle,
      startAge: this.startAge,
      endAge: this.endAge,
      uidNo,
      rollNo,
      singleActivityCode: activityName
    };
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.reportService.getBranchPeopleAttendance(dataToPush, 0).subscribe(
      (response) => {
        if (response) {
          console.log(response.data);
          response.data.branchPeopleAttendance.forEach(element => {
            element.attendanceDate = this.utilsService.formatDateDDMMYYY(element.attendanceDate)
          });
          this.branchPeopleDetailedAttendance = response.data.branchPeopleAttendance;
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
        }
        setTimeout(() => { this.spinner.hide(); }, 500);
      },
      (error) => {
        this.spinner.hide();
        const errMsg = this.utilsService.errorServiceHandler(error);
        this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + errMsg,
          '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
      }
    );
  }

  onGridReady(params) {
    this.gridApi = params;
  }
  onBtnExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      fileName: `Attendace_summary.csv`
    };
    this.gridApi.api.exportDataAsCsv(params);
  }

  changePage(event) {
    this.getBranchPeopleAttendance();
  }
}
