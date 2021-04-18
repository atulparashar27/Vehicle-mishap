import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { CONSTANTS } from 'app/utils/Constants';
import { ReportsService } from 'app/utils/services/reports/reports.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-attendance-summary',
  templateUrl: './attendance-summary.component.html',
  styleUrls: ['./attendance-summary.component.css']
})
export class AttendanceSummaryComponent implements OnInit {

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
    { headerName: 'Activity Name', field: 'activityName', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Attendance Date', field: 'attendanceDate', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Initiated', field: 'totalIni', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Jigyasu', field: 'totalJig', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Childs', field: 'totalChil', width: 150, resizable: true, filter: true, sortable: true },
    // { headerName: 'Total Sant Su', field: 'totalSantSu', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Others', field: 'totalOther', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Initiated Visitors', field: 'totalVisitorIni', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total Other Visitors', field: 'totalVisitorOther', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Total People', field: 'totalPeople', width: 150, resizable: true, filter: true, sortable: true },
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
      endDate: this.utilsService.formatDate(this.attendDateRange[1])
    };
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.reportService.getBranchPeopleAttendanceSummary(dataToPush).subscribe(
      (response) => {
        if (response.success) {
          response.data.forEach(element => {
            element.attendanceDate = this.utilsService.formatDateDDMMYYY(element.attendanceDate)
          });
          this.branchPeopleAttendance = response.data;
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
