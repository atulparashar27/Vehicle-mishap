import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { DataManagmentService } from 'app/utils/services/datamanagment/datamanagment.service';
import { LoginService } from 'app/utils/services/login/login.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-permissions-codes',
  templateUrl: './manage-permissions-codes.component.html',
  styleUrls: ['./manage-permissions-codes.component.scss']
})
export class ManagePermissionsCodesComponent implements OnInit {
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  rolesDDList = [];
  rolesColumDefs = [
    { headerName: 'Role Id', field: 'roleId', width: 100, resizable: true },
    { headerName: 'Role Name', field: 'roleName', width: 177, resizable: true },
    { headerName: 'Description', field: 'roleDesc', width: 370, resizable: true }
  ];
  code = '';
  name = '';
  desc = '';
  hideAddNew: Boolean = false;
  enableNameField: Boolean = false;
  selectedROw;
  touchedRow;
  txtMsg = '';
  actionToProcess = 0;
  actionTxt = '';
  editPermission = true;
  loadSecondTab = false;
  editAssignedPermission = true;
  @HostBinding('style.height') height;

  constructor(private loginService: LoginService, private spinner: NgxSpinnerService, private utilsService: UtilsService,
    private datamanagementService: DataManagmentService, private alertService: ToastrService, public activeModal: NgbModal) { }

  onResize(event) {
    this.height = (event.target.innerHeight - 265);
  }
  ngOnInit(): void {
    this.height = this.height ? this.height : (window.innerHeight - 284);
    this.getAllRolesLists();
    const permissionsCodeList = this.loginService.getUserRoles().some(res => res.roleId === 8 && res.accessType === 'Write');
    if (permissionsCodeList) {
      this.editPermission = false;
    }

    const assignedPermissionsCodeList = this.loginService.getUserRoles().some(res => res.roleId === 9 && res.accessType === 'Write');
    if (assignedPermissionsCodeList) {
      this.editAssignedPermission = false;
    }
  }

  getAllRolesLists() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.datamanagementService.getAllRolesLists().subscribe(
      (response) => {
        if (response.data) {
          this.rolesDDList = response.data;
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
    setTimeout(() => {
      this.spinner.hide();
      this.selectedROw = event.data;
      if (this.selectedROw) {
        this.code = this.selectedROw.roleId;
        this.name = this.selectedROw.roleName;
        this.desc = this.selectedROw.roleDesc;
        this.hideAddNew = true;
      }
    }, 500);
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
    this.desc = null;
  }

  onRowClicked(event) {
    this.touchedRow = event.api.getSelectedRows();
  }

  saveModalShow(modal) {
    this.actionToProcess = 1;
    this.txtMsg = 'Are you sure you want to save the Roles?';
    this.activeModal.open(modal);
  }

  deleteSelectedRec(modal) {
    this.actionToProcess = 2;
    this.txtMsg = 'Are you sure you want to delete the selected Role?';
    this.activeModal.open(modal);
  }

  changeRoles() {
    if (this.actionToProcess === 2) {
      this.actionTxt = 'DELETE';
      this.code = this.touchedRow[0].roleId;
      this.name = this.touchedRow[0].roleName;
      this.desc = this.touchedRow[0].roleDesc;
    }
    if (this.actionToProcess === 1) {
      if (this.code) {
        this.actionTxt = 'EDIT';
      } else {
        this.actionTxt = 'ADD';
      }
    }
    const dataToPush = {
      roleId: this.code || -1,
      roleName: this.name,
      roleDesc: this.desc
    };
    if (!dataToPush.roleName.trim()) {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Role Name cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    } else if (!dataToPush.roleDesc.trim()) {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Role Description cannot be blank',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    } else {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.datamanagementService.changeRolesList(this.actionTxt, dataToPush).subscribe(
        (response) => {
          if (response.success) {
            this.clearForm();
            this.getAllRolesLists();
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Successfully Processed',
              '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
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
}
