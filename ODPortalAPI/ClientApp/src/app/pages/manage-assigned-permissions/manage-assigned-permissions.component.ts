import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { DataManagmentService } from 'app/utils/services/datamanagment/datamanagment.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-manage-assigned-permissions',
  templateUrl: './manage-assigned-permissions.component.html',
  styleUrls: ['./manage-assigned-permissions.component.scss']
})
export class ManageAssignedPermissionsComponent implements OnInit {

  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  allPeopleList = [];
  allRolesList = [];
  peopleColumDefs = [
    { headerName: 'Name', field: 'name', width: 174, resizable: true, filter: true, sortable: true, tooltipField: 'name' },
    { headerName: 'UID Number', field: 'uidNo', width: 150, resizable: true, filter: true, sortable: true, tooltipField: 'uidNo' },
  ];
  assignedRolesColumnDefs = [
    { headerName: 'Role Id', field: 'roleId', width: 100, resizable: true, filter: true, sortable: true },
    { headerName: 'Role Name', field: 'roleName', width: 180, resizable: true, filter: true, sortable: true },
    { headerName: 'Access Type', field: 'accessType', width: 150, resizable: true, filter: true, sortable: true },
    { headerName: 'Role Description', field: 'roleDesc', width: 350, resizable: true, filter: true, sortable: true }
  ];
  allRolesPermissionDDList = [];
  selectedUidNo: any;
  getAssignedPermission = true;
  actionCode = []; // = 'Read';
  actionArray = [{ actId: 'Read', actName: 'Read' }, { actId: 'Write', actName: 'Write' }];
  selectedPeoplePermissions = [];
  selectedRow;
  removedPermissions;
  newlyAddPermissions = [];
  enableDropDown = true;
  dropdownSettings = {};
  selectedRolesCode = [];
  @HostBinding('style.height') height;
  @Input()
  public set rolesDDList(event) {
    this.allRolesList = event.map(p => ({ actId: p.roleId.toString(), actName: p.roleName, roleDesc: p.roleDesc }));
  }
  @Input()
  public set editAssignedPermission(event) {
    this.getAssignedPermission = event;
  }
  constructor(private spinner: NgxSpinnerService, private datamanagementService: DataManagmentService,
    private alertService: ToastrService, private utilsService: UtilsService, private activeModal: NgbModal) { }
  onResize(event) {
    this.height = (event.target.innerHeight - 335);
  }
  ngOnInit(): void {
    this.height = this.height ? this.height : (window.innerHeight - 260);
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
  }

  getPeopleData() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.datamanagementService.getPeopleData('CR').subscribe(
      (response) => {
        if (response.data) {
          this.allPeopleList = response.data;
          this.allRolesPermissionDDList = this.allRolesList;
          this.actionArray = [{ actId: 'Read', actName: 'Read' }, { actId: 'Write', actName: 'Write' }];
        } else {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
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

  resetPermissionArray() {
    this.removedPermissions = null;
    this.newlyAddPermissions = [];
    this.selectedRow = null;
  }

  onRowDoubleClick(event) {
    if (this.selectedUidNo) {
      this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
      this.datamanagementService.getAssignedRoles(this.selectedUidNo).subscribe(
        (response) => {
          if (response.rolesDetailsList) {
            this.selectedPeoplePermissions = response.rolesDetailsList;
            this.enableDropDown = false;
            this.resetPermissionArray();
          } else {
            this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + response.message,
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
    } else {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Cannot Assign role to the selected member',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    }
  }

  onRowSelection(event) {
    this.selectedRow = event.api.getSelectedRows();
  }

  onUidNoSelect(event) {
    this.selectedUidNo = (event.api.getSelectedRows())[0].uidNo;
  }

  deleteSelectedRows() {
    const selectedRow = JSON.parse(JSON.stringify(this.selectedRow));
    const allPermissions = JSON.parse(JSON.stringify(this.selectedPeoplePermissions));

    this.selectedRow.forEach(elem => {
      for (let i = 0; i < allPermissions.length; i++) {
        if (elem.roleId === allPermissions[i].roleId && elem.accessType === allPermissions[i].accessType) {
          allPermissions.splice(i, 1);
          break;
        }
      }
    });
    this.selectedPeoplePermissions = JSON.parse(JSON.stringify(allPermissions));
    this.removedPermissions = JSON.parse(JSON.stringify(selectedRow));
    this.selectedRow = null;
  }

  addSelectedPermissions() {
    const roleIdConst = +this.selectedRolesCode[0].actId;
    const accessType = this.actionCode[0].actId;
    const readWriteAccess = this.selectedPeoplePermissions.some(param => param.roleId === roleIdConst && param.accessType === accessType);

    if (readWriteAccess) {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'This role is already assigned',
        '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    } else {
      const dataToPush = {
        roleId: +this.selectedRolesCode[0].actId,
        roleName: this.selectedRolesCode[0].actName,
        accessType: this.actionCode[0].actId,
        roleDesc: (this.allRolesList.filter((param) => (param.actId === roleIdConst.toString()))[0].roleDesc)
      };
      const dataToAdd = JSON.parse(JSON.stringify(this.selectedPeoplePermissions));
      dataToAdd.push(dataToPush);
      this.selectedPeoplePermissions = JSON.parse(JSON.stringify(dataToAdd));
      this.newlyAddPermissions.push(dataToPush);
    }
  }

  confirmDeleteRoles(modal) {
    this.activeModal.open(modal);
  }

  confirmAddRole(modal) {
    this.activeModal.open(modal);
  }

  deleteSelectedRoles() {
    this.deleteSelectedRows();
    const rolesDetailsList = [];
    if (this.removedPermissions) {
      for (let i = 0; i < this.removedPermissions.length; i++) {
        const newObj = {
          roleId: this.removedPermissions[i].roleId,
          accessType: this.removedPermissions[i].accessType
        };
        rolesDetailsList.push(newObj);
      }
      const dataToPush = {
        uidNo: this.selectedUidNo,
        rolesDetailsList: this.removedPermissions.map(p => ({ roleId: p.roleId, accessType: p.accessType }))
      };
      this.submitPermissions(dataToPush, 'DELETE');
    }
  }

  addNewRoleChanges() {
    let rolesDetailsList = [];
    rolesDetailsList = [];
    // rolesDetailsList = this.newlyAddPermissions.map(p => ({roleId: p.newlyAddPermissions, accessType: p.accessType}));
    if (this.newlyAddPermissions.length !== 0) {
      for (let i = 0; i < this.newlyAddPermissions.length; i++) {
        const newObj = {
          roleId: this.newlyAddPermissions[i].roleId,
          accessType: this.newlyAddPermissions[i].accessType
        };
        rolesDetailsList.push(newObj);
      }
      const dataToPush = {
        uidNo: this.selectedUidNo,
        rolesDetailsList: this.newlyAddPermissions.map(s => ({ roleId: s.roleId, accessType: s.accessType }))
      };
      this.submitPermissions(dataToPush, 'ADD');
    }
  }

  submitPermissions(dataToPush, action) {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.datamanagementService.submitPermissions(dataToPush, action).subscribe(
      (response) => {
        if (response) {
          this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'Successfully Processed',
            '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_SUCCESS);
          this.onRowDoubleClick(this.selectedUidNo);
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

}
