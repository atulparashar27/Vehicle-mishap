import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminLayoutRoutes } from './admin-layout.routing';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { ManageFamilyDetailsComponent } from '../../pages/manage-family-details/manage-family-details.component';
import { ActivityAttendanceComponent } from '../../pages/activity-attendance/activity-attendance.component';
import { VisitorsAttendanceComponent } from '../../pages/visitors-attendance/visitors-attendance.component';
import { ManageActivityCodesComponent } from '../../pages/manage-activity-codes/manage-activity-codes.component';
import { ManagePermissionsCodesComponent } from '../../pages/manage-permissions-codes/manage-permissions-codes.component';
import { ManageAssignedPermissionsComponent } from '../../pages/manage-assigned-permissions/manage-assigned-permissions.component';
import { ResetPasswordComponent } from '../../pages/reset-password/reset-password.component';
import { ManageBranchDetailsComponent } from 'app/pages/manage-branch-details/manage-branch-details.component';
import { ReportsComponent } from '../../pages/reports/reports.component';
import { BranchPeopleAttendanceComponent } from '../../pages/reports/branch-people-attendance/branch-people-attendance.component';
import { BranchPeopleDataComponent } from '../../pages/reports/branch-people-data/branch-people-data.component';
import { AttendanceSummaryComponent } from '../../pages/reports/attendance-summary/attendance-summary.component';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BsDatepickerModule  } from 'ngx-bootstrap/datepicker';
import { MiscComponent } from 'app/pages/misc/misc.component';
import { GridCoordComponent } from 'app/pages/misc/grid-coord/grid-coord.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AgGridModule.withComponents([]),
    NgMultiSelectDropDownModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    ProfileComponent,
    TableComponent,
    UpgradeComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    NotificationsComponent,
    ManageFamilyDetailsComponent,
    ActivityAttendanceComponent,
    VisitorsAttendanceComponent,
    ManageActivityCodesComponent,
    ManagePermissionsCodesComponent,
    ManageAssignedPermissionsComponent,
    ResetPasswordComponent,
    ManageBranchDetailsComponent,
    ReportsComponent,
    BranchPeopleAttendanceComponent,
    BranchPeopleDataComponent,
    AttendanceSummaryComponent,
    MiscComponent,
    GridCoordComponent
  ]
})

export class AdminLayoutModule { }
