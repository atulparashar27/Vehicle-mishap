import { Component, HostBinding, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CONSTANTS } from 'app/utils/Constants';
import { LoginService } from 'app/utils/services/login/login.service';
import { MiscService } from 'app/utils/services/misc/misc.service';
import { UtilsService } from 'app/utils/services/util.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grid-coord',
  templateUrl: './grid-coord.component.html',
  styleUrls: ['./grid-coord.component.scss']
})
export class GridCoordComponent implements OnInit {

  tableTheme = CONSTANTS.MAIN.APP.CONSTANTS.AG_GRID_CLS_THEME;
  dropdownSettings = {};
  selectedLocalityCode = [];
  allLocalityCodeDDList = [];
  localityPeopleList = [];
  localityPeopleColumDefs = [
    { headerName: 'UID Number', field: 'uidNo', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Name', field: 'fullName', width: 220, resizable: true, filter: true, sortable: true,
    // cellStyle: params => {
    //   if (params.value === 'Police') {
    //       return {color: 'red', backgroundColor: 'green'};
    //   }
    //   return null;
    // }
    },
    { headerName: 'Mobile Number', field: 'mobileNum', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Mobile Number 2', field: 'mobileNum2', width: 220, resizable: true, filter: true, sortable: true },
    { headerName: 'Family Code', field: 'familyCode', width: 220, resizable: true, filter: true, sortable: true }
  ];
  @HostBinding('style.height') height;
  constructor(private miscService: MiscService, private spinner: NgxSpinnerService, private utilsService: UtilsService,
    private loginService: LoginService, public activeModal: NgbModal, private alertService: ToastrService) { }
  onResize(event) {
      this.height = (event.target.innerHeight - 175);
  }
  ngOnInit(): void {
    this.dropdownSettings = {
      singleSelection: true,
      idField: 'localityId',
      textField: 'locality',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    this.getLocalityData();
  }

  getLocalityData() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.miscService.getLocalityData().subscribe(
      (response) => {
        if (response.data) {
          this.allLocalityCodeDDList = response.data;
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

  getLocalityPeopleData() {
    this.spinner.show(undefined, { type: 'ball-fussion', color: 'rgba(100,149,237,.8)' });
    this.miscService.getLocalityPeopleData(this.selectedLocalityCode[0].localityId).subscribe(
      (response) => {
        if (response.data) {
            this.localityPeopleList = response.data;
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
}
