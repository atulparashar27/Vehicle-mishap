import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridAngular } from 'ag-grid-angular';
import { CONSTANTS } from 'app/utils/Constants';
import { LoginService } from 'app/utils/services/login/login.service';
import { ProfileService } from 'app/utils/services/profile/profile.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfileComponent } from '../profile/profile.component';

@Component({
  selector: 'app-manage-family-details',
  templateUrl: './manage-family-details.component.html',
  styleUrls: ['./manage-family-details.component.scss']
})
export class ManageFamilyDetailsComponent implements OnInit {

  familyDetailsList = [];
  familyColumnDefs = [
    { headerName: 'UID Number', field: 'uidNo', width: 220, resizable: true},
    { headerName: 'Name', field: 'name', width: 280, resizable: true },
    { headerName: 'Status', field: 'iniJigStatus', resizable: true },
    { headerName: 'Relation', field: 'relation', resizable: true}
  ];
  public tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  roleEditPermission = true;
  uidNum = null;
  setFamilyDetails = [];
  @ViewChild('familyMember', {static: false}) ErTableGrid: AgGridAngular;
  @ViewChild ('familyChildComponent') familyChildComponent: ProfileComponent;
  @ViewChild ('childComp1') childComp1: ProfileComponent;
  @HostBinding('style.height') height;

  constructor(private spinner: NgxSpinnerService, private profileService: ProfileService, public activeModal: NgbModal,
    private utilsService: UtilsService, private loginService: LoginService, private alertService: ToastrService) { }
  onResize(event) {
    this.height = (event.target.innerHeight - 265);
  }
  ngOnInit() {
    this.height = this.height ? this.height : (window.innerHeight - 250);
    this.uidNum = this.loginService.getUserloggedIn().uidNo;
    this.getFamilyDetails(this.uidNum);
    const profileRoleList = this.loginService.getUserRoles()
        .some(function (res: any) { return (res.roleId === 2 && res.accessType === 'Write'); });
    if (profileRoleList) {
      this.roleEditPermission = false;
    }
  }

  tabChanges(event) {
    console.log(event);
  }

  onRowDoubleClicked(event, modal) {
    if (this.roleEditPermission) {
      this.alertService.show(CONSTANTS.MAIN.APP.CONSTANTS.ALERT_MSG_ICON + 'You cannot edit Family Details',
                 '', CONSTANTS.MAIN.APP.CONSTANTS.MSG_TYPE_ERR);
    } else {
      const passData = event.data;
      if (passData.uidNo || passData.rollNo) {
        const test = this.activeModal.open(modal, { size: 'xl' });
        // this.familyChildComponent.callGetProfile(passData.uidNo, passData.rollNo);
        // test.componentInstance.callGetProfile(passData.uidNo, passData.rollNo);
        this.setFamilyDetails = [passData.uidNo, passData.rollNo]
      }
    }
  }

  getFamilyDetails(event) {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.profileService.getFamilyDetails(event).subscribe(
      (response) => {
        if (response) {
          this.familyDetailsList = response.data;
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
