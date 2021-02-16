import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { DataManagmentService } from 'app/utils/services/datamanagment/datamanagment.service';
import { LoginService } from 'app/utils/services/login/login.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-activity-codes',
  templateUrl: './manage-activity-codes.component.html',
  styleUrls: ['./manage-activity-codes.component.scss']
})
export class ManageActivityCodesComponent implements OnInit {
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  activityDDList = [];
  activtyColumDefs = [
    { headerName: 'Activity Code', field: 'actId', width: 250, resizable: true, filter: true, sortable: true  },
    { headerName: 'Activity Name', field: 'actName', width: 300, resizable: true, filter: true, sortable: true  }
  ];
  code = '';
  name = '';
  hideAddNew: Boolean = false;
  enableNameField: Boolean = false;
  selectedROw;
  touchedRow;
  txtMsg = '';
  actionToProcess = 0;
  actionTxt = '';
  activityEditPermission = true;
  @HostBinding('style.height') height;
  onResize(event) {
    this.height = (event.target.innerHeight - 365);
  }
  constructor(private loginService: LoginService, private spinner: NgxSpinnerService, private alertService: ToastrService,
     private datamanagementService: DataManagmentService, private utilsService: UtilsService, private activeModal: NgbModal) { }

  ngOnInit() {
    this.height = this.height ? this.height : (window.innerHeight - 250);
    this.getAllActivityLists();
    const activityRoleList = this.loginService.getUserRoles()
                            .some(function (res: any) { return (res.roleId === 7
                                   && res.accessType === 'Write'); });
    if (activityRoleList) {
      this.activityEditPermission = false;
    }
  }

  getAllActivityLists() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.datamanagementService.getAllActivityLists().subscribe(
      (response) => {
        if (response.activityDetailsList) {
          this.activityDDList = response.activityDetailsList;
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

  onRowSelection(event) {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    setTimeout(() => { this.spinner.hide();
      this.selectedROw = event.data;
      if (this.selectedROw) {
        this.code = this.selectedROw.actId;
        this.name = this.selectedROw.actName;
        this.hideAddNew = true;
      } }, 500);
  }

  addNewRecord() {
    this.enableNameField = true;
  }

  clearForm() {
    this.code = null;
    this.name = null;
    this.enableNameField = false;
    this.hideAddNew = false;
    this.selectedROw = null;
    this.touchedRow = null;
  }

  onRowClicked(event) {
    this.touchedRow = event.api.getSelectedRows();
  }

  saveModalShow(modal) {
    this.actionToProcess = 1;
    this.txtMsg = 'Are you sure you want to save the Activity?';
    this.activeModal.open(modal);
  }

  deleteSelectedRec(modal) {
    this.actionToProcess = 2;
    this.txtMsg = 'Are you sure you want to delete the selected Activity?';
    this.activeModal.open(modal);
  }

  changeActivity() {
    if (this.actionToProcess === 2) {
      this.actionTxt = 'DELETE';
      this.code = this.touchedRow[0].actId;
      this.name = this.touchedRow[0].actName;
    }
    if (this.actionToProcess === 1) {
      if (this.code) {
        this.actionTxt = 'EDIT';
      } else {
        this.actionTxt = 'ADD';
      }
    }
    const dataToPush = {
      actId : this.code,
      actName: this.name
    };
    if (!dataToPush.actName.trim()) {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Activity Name cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    } else {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.datamanagementService.changeActivityList(this.actionTxt, dataToPush ).subscribe(
        (response) => {
          if (response.success) {
              this.clearForm();
              this.getAllActivityLists();
              this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Successfully Processed',
                  '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
          } else {
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
                  '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
          }
          setTimeout(() => { this.spinner.hide(); }, 1000);
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
}
