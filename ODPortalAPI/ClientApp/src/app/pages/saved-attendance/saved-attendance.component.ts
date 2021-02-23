import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { CONSTANTS } from 'app/utils/Constants';
import { AttendanceService } from 'app/utils/services/attendance/attendance.service';
import { LoginService } from 'app/utils/services/login/login.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-saved-attendance',
  templateUrl: './saved-attendance.component.html',
  styleUrls: ['./saved-attendance.component.css']
})
export class SavedAttendanceComponent implements OnInit {
  delhiMale: any = [0, 0, 0, 0, 0, 0];
  delhiFemale: any = [0, 0, 0, 0, 0, 0];
  outsideMale: any = [0, 0, 0, 0, 0, 0];
  outsideFemale: any = [0, 0, 0, 0, 0, 0];
  maleTotal: any = [0, 0, 0, 0, 0, 0];
  femaleTotal: any = [0, 0, 0, 0, 0, 0];
  summaryAttendanceList = [];
  summaryAttendanceColDefs = [
    {
      headerName: ' ', resizable: true,
      children: [{ headerName: 'Category', field: 'category', width: 240, resizable: true, }]
    },
    {
      headerName: 'OD Branch', resizable: true,
      children:
        [
          { headerName: 'Male', field: 'delhiMale', resizable: true, width: 70 },
          { headerName: 'Female', field: 'delhiFemale', resizable: true, width: 80 }
        ]
    },
    {
      headerName: 'Visitors', resizable: true,
      children:
        [
          { headerName: 'Male', field: 'outsideMale', resizable: true, width: 70 },
          { headerName: 'Female', field: 'outsideFemale', resizable: true, width: 80 }
        ]
    },
    {
      headerName: 'Total', resizable: true,
      children:
        [
          { headerName: 'Male', field: 'maleTotal', resizable: true, width: 70, cellStyle: { 'background-color': '#90ee90' } },
          { headerName: 'Female', field: 'femaleTotal', resizable: true, width: 80, cellStyle: { 'background-color': '#90ee90' } },
        ]
    }
  ];

  markedAttendancList: any = [];
  attendanceColumDefs = [
    {
      headerName: 'UID Number', field: 'uidNo',
      width: 220, resizable: true, filter: true, sortable: true
    },
    {
      headerName: 'Name', field: 'name',
      width: 280, resizable: true, filter: true, sortable: true
    },
    {
      headerName: 'Current Status', field: 'iniJigStatus',
      resizable: true, filter: true, sortable: true
    }
  ];
  attendCode = null;
  attendDate = null;
  gridApi: GridOptions;
  routePassedCode = null;
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  selectedRows = [];
  isAllowDelete = false;
  @ViewChild('attendanceTable', { static: false }) ErTableGrid: AgGridAngular;
  @ViewChild('summaryTable', { static: false }) summaryTable: AgGridAngular;
  // @ViewChild('attendanceSummaryModal', { static: false }) attendanceSummaryModal: ngb;
  @HostBinding('style.height') height;
  constructor(private route: ActivatedRoute, public alertService: ToastrService,
    public attendanceService: AttendanceService, private spinner: NgxSpinnerService,
    private utilsService: UtilsService, private activeModal: NgbModal,
    private loginService: LoginService) { }
  onResize(event) {
    this.height = (event.target.innerHeight - 265);
  }
  ngOnInit() {
    this.height = this.height ? this.height : (window.innerHeight - 280);
    this.route.params.subscribe(params => {
      if (params['code'] && params['date']) {
        const passedCode = params['code'];
        this.routePassedCode = passedCode;
        const passedAttendDate = params['date'];
        this.getSavedAttendance(passedCode, passedAttendDate);
      }
    });
    this.gridApi = <GridOptions>{
      columnDefs: this.summaryAttendanceColDefs,
      rowData: this.summaryAttendanceList,
      groupSelectsChildren: true,
      suppressRowClickSelection: true,
      context: { parentComponent: this },
      rowSelection: 'multiple',
      enableColResize: true,
      enableSorting: true
    };
    const attendanceRoleList = this.loginService.getUserRoles()
      .some(function (res: any) { return (res.roleId === 11 && res.accessType === 'Write'); });
    if (attendanceRoleList) {
      this.isAllowDelete = true;
    }
  }

  onGridReady(params) {
    this.gridApi = params;
  }
  getSavedAttendance(code, date) {
    this.delhiMale = [0, 0, 0, 0, 0, 0];
    this.delhiFemale = [0, 0, 0, 0, 0, 0];
    this.outsideMale = [0, 0, 0, 0, 0, 0];
    this.outsideFemale = [0, 0, 0, 0, 0, 0];
    this.maleTotal = [0, 0, 0, 0, 0, 0];
    this.femaleTotal = [0, 0, 0, 0, 0, 0];
    this.summaryAttendanceList = [];
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.getActivityAttendance(code, date).subscribe(
      (response) => {
        if (response.data) {
          this.markedAttendancList = JSON.parse(JSON.stringify(response.data.savedAttendancePeopleModals));
          if (this.markedAttendancList) {
            for (let i = 0; i < this.markedAttendancList.length; i++) {
              if (this.markedAttendancList[i].iniJigStatus === 'Initiated' &&
                this.markedAttendancList[i].gender === 'M' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiMale[0] = !this.delhiMale[0] ? 1 : this.delhiMale[0] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Initiated' &&
                this.markedAttendancList[i].gender === 'F' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiFemale[0] = !this.delhiFemale[0] ? 1 : this.delhiFemale[0] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Jigyasu' &&
                this.markedAttendancList[i].gender === 'M' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiMale[1] = !this.delhiMale[1] ? 1 : this.delhiMale[1] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Jigyasu' &&
                this.markedAttendancList[i].gender === 'F' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiFemale[1] = !this.delhiFemale[1] ? 1 : this.delhiFemale[1] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' && this.markedAttendancList[i].isSantSu === 'N' &&
                this.markedAttendancList[i].gender === 'M' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiMale[2] = !this.delhiMale[2] ? 1 : this.delhiMale[2] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' && this.markedAttendancList[i].isSantSu === 'N' &&
                this.markedAttendancList[i].gender === 'F' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiFemale[2] = !this.delhiFemale[2] ? 1 : this.delhiFemale[2] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' && this.markedAttendancList[i].isSantSu === 'Y' &&
                this.markedAttendancList[i].gender === 'M' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiMale[3] = !this.delhiMale[3] ? 1 : this.delhiMale[3] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' && this.markedAttendancList[i].isSantSu === 'Y' &&
                this.markedAttendancList[i].gender === 'F' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiFemale[3] = !this.delhiFemale[3] ? 1 : this.delhiFemale[3] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Other' &&
                this.markedAttendancList[i].gender === 'M' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiMale[4] = !this.delhiMale[4] ? 1 : this.delhiMale[4] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Other' &&
                this.markedAttendancList[i].gender === 'F' && this.markedAttendancList[i].branchName === 'OD Branch') {
                this.delhiFemale[4] = !this.delhiFemale[4] ? 1 : this.delhiFemale[4] + 1;
              }
              // Visitors Counts
              if (this.markedAttendancList[i].iniJigStatus === 'Initiated' &&
                this.markedAttendancList[i].gender === 'M' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideMale[0] = !this.outsideMale[0] ? 1 : this.outsideMale[0] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Initiated' &&
                this.markedAttendancList[i].gender === 'F' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideFemale[0] = !this.outsideFemale[0] ? 1 : this.outsideFemale[0] + 1;
              }

              if (this.markedAttendancList[i].iniJigStatus === 'Jigyasu' &&
                this.markedAttendancList[i].gender === 'M' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideMale[1] = !this.outsideMale[1] ? 1 : this.outsideMale[1] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Jigyasu' &&
                this.markedAttendancList[i].gender === 'F' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideFemale[1] = !this.outsideFemale[1] ? 1 : this.outsideFemale[1] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' &&
                this.markedAttendancList[i].gender === 'M' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideMale[2] = !this.outsideMale[2] ? 1 : this.outsideMale[2] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Child' &&
                this.markedAttendancList[i].gender === 'F' &&
                this.markedAttendancList[i].branchName !== 'OD Branch') {
                this.outsideFemale[2] = !this.outsideFemale[2] ? 1 : this.outsideFemale[2] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Other' &&
                this.markedAttendancList[i].branchName !== 'OD Branch' &&
                this.markedAttendancList[i].gender === 'M') {
                this.outsideMale[4] = !this.outsideMale[4] ? 1 : this.outsideMale[4] + 1;
              }
              if (this.markedAttendancList[i].iniJigStatus === 'Other' &&
                this.markedAttendancList[i].branchName !== 'OD Branch' &&
                this.markedAttendancList[i].gender === 'F') {
                this.outsideFemale[4] = !this.outsideFemale[4] ? 1 : this.outsideFemale[4] + 1;
              }
            }
          }
          this.attendCode = JSON.parse(JSON.stringify(response.data.activityName));
          this.attendDate = this.utilsService.formatDateDDMMYYY(response.data.activityDate);
          this.configureRows();
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

  onBtnExport() {
    const params = {
      skipHeader: false,
      skipFooters: false,
      skipGroups: false,
      fileName: `Attendace_${this.attendCode}_${this.attendDate}.csv`
    };
    this.gridApi.api.exportDataAsCsv(params);
  }

  configureRows() {
    this.summaryAttendanceList = [
      {
        category: 'Initiated', delhiMale: this.delhiMale[0], delhiFemale: this.delhiFemale[0],
        outsideMale: this.outsideMale[0], outsideFemale: this.outsideFemale[0],
        maleTotal: !(this.delhiMale[0] + this.outsideMale[0]) ? 0 : this.delhiMale[0] + this.outsideMale[0],
        femaleTotal: !(this.delhiFemale[0] + this.outsideFemale[0]) ? 0 : this.delhiFemale[0] + this.outsideFemale[0]
      },

      {
        category: 'Jigyasus', delhiMale: this.delhiMale[1], delhiFemale: this.delhiFemale[1],
        outsideMale: this.outsideMale[1], outsideFemale: this.outsideFemale[1],
        maleTotal: !(this.delhiMale[1] + this.outsideMale[1]) ? 0 : this.delhiMale[1] + this.outsideMale[1],
        femaleTotal: !(this.delhiFemale[1] + this.outsideFemale[1]) ? 0 : this.delhiFemale[1] + this.outsideFemale[1]
      },

      {
        category: 'Children upto 15 yrs(excluding Sant-Su)', delhiMale: this.delhiMale[2], delhiFemale: this.delhiFemale[2],
        outsideMale: this.outsideMale[2], outsideFemale: this.outsideFemale[2],
        maleTotal: !(this.delhiMale[2] + this.outsideMale[2]) ? 0 : this.delhiMale[2] + this.outsideMale[2],
        femaleTotal: !(this.delhiFemale[2] + this.outsideFemale[2]) ? 0 : this.delhiFemale[2] + this.outsideFemale[2]
      },

      {
        category: 'Children(Sant-Su)', delhiMale: this.delhiMale[3], delhiFemale: this.delhiFemale[3],
        outsideMale: this.outsideMale[3], outsideFemale: this.outsideFemale[3],
        maleTotal: !(this.delhiMale[3] + this.outsideMale[3]) ? 0 : this.delhiMale[3] + this.outsideMale[3],
        femaleTotal: !(this.delhiFemale[3] + this.outsideFemale[3]) ? 0 : this.delhiFemale[3] + this.outsideFemale[3]
      },

      {
        category: 'Non Initiated/Others', delhiMale: this.delhiMale[4], delhiFemale: this.delhiFemale[4],
        outsideMale: this.outsideMale[4], outsideFemale: this.outsideFemale[4],
        maleTotal: !(this.delhiMale[4] + this.outsideMale[4]) ? 0 : this.delhiMale[4] + this.outsideMale[4],
        femaleTotal: !(this.delhiFemale[4] + this.outsideFemale[4]) ? 0 : this.delhiFemale[4] + this.outsideFemale[4]
      },

      {
        category: 'Total', delhiMale: (this.delhiMale[0] + this.delhiMale[1] + this.delhiMale[2] + this.delhiMale[3] + this.delhiMale[4]),
        delhiFemale: (this.delhiFemale[0] + this.delhiFemale[1] + this.delhiFemale[2] + this.delhiFemale[3] + this.delhiFemale[4]),
        outsideMale: this.outsideMale[0] + this.outsideMale[1] + this.outsideMale[2] + this.outsideMale[3] + this.outsideMale[4],
        outsideFemale: this.outsideFemale[0] + this.outsideFemale[1] + this.outsideFemale[2] + this.outsideFemale[3] +
         this.outsideFemale[4],
        maleTotal: (this.delhiMale[0] + this.delhiMale[1] + this.delhiMale[2] + this.delhiMale[3] + this.delhiMale[4] +
           this.outsideMale[0] +
          this.outsideMale[1] + this.outsideMale[2] + this.outsideMale[3] + this.outsideMale[4]),
        femaleTotal: (this.delhiFemale[0] + this.delhiFemale[1] + this.delhiFemale[2] + this.delhiFemale[3] + this.delhiFemale[4] +
          this.outsideFemale[0] + this.outsideFemale[1] + this.outsideFemale[2] + this.outsideFemale[3] + this.outsideFemale[4])
      }
    ];
  }

  openModal(modal) {
    this.activeModal.open(modal, { size: 'lg' });
  }

  deleteModla(modal) {
    this.activeModal.open(modal, { size: 'sm' });
  }

  onRowSelection(event) {
    this.selectedRows = event.api.getSelectedRows();
  }

  deleteSelectedAttendance() {
    const dataToSend = {
      rollNoList: this.selectedRows.map(s => +s.rollNo),
      activityCode: this.routePassedCode,
      activityDate: this.utilsService.formatDate(this.attendDate)
    };
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.attendanceService.deleteSelectedAttendance(dataToSend).subscribe(
      (response) => {
        if (response.success) {
          this.ngOnInit();
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
}
