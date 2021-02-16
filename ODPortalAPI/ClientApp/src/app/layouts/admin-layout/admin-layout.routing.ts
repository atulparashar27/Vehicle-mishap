import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ProfileComponent } from '../../pages/profile/profile.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';
import { MapsComponent } from '../../pages/maps/maps.component';
import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';
import { ManageFamilyDetailsComponent } from 'app/pages/manage-family-details/manage-family-details.component';
import { ActivityAttendanceComponent } from 'app/pages/activity-attendance/activity-attendance.component';
import { ManageActivityCodesComponent } from 'app/pages/manage-activity-codes/manage-activity-codes.component';
import { ManagePermissionsCodesComponent } from 'app/pages/manage-permissions-codes/manage-permissions-codes.component';
import { PermissionAccessGuard } from 'app/utils/services/guards/permission.service';
import { ResetPasswordComponent } from 'app/pages/reset-password/reset-password.component';
import { ManageBranchDetailsComponent } from 'app/pages/manage-branch-details/manage-branch-details.component';
import { ReportsComponent } from 'app/pages/reports/reports.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'profile', component: ProfileComponent, canActivate: [PermissionAccessGuard] },
    // { path: 'table', component: TableComponent },
    // { path: 'typography', component: TypographyComponent },
    { path: 'icons', component: IconsComponent },
    // { path: 'maps', component: MapsComponent },
    // { path: 'notifications', component: NotificationsComponent },
    // { path: 'upgrade', component: UpgradeComponent },
    { path: 'familyDetails', component: ManageFamilyDetailsComponent, canActivate: [PermissionAccessGuard] },
    { path: 'attendance', component: ActivityAttendanceComponent, canActivate: [PermissionAccessGuard] },
    { path: 'manageActivities', component: ManageActivityCodesComponent, canActivate: [PermissionAccessGuard] },
    { path: 'managePermissions', component: ManagePermissionsCodesComponent, canActivate: [PermissionAccessGuard] },
    { path: 'resetPassword', component: ResetPasswordComponent, canActivate: [PermissionAccessGuard] },
    { path: 'manageBranchDetails', component: ManageBranchDetailsComponent, canActivate: [PermissionAccessGuard] },
    { path: 'reports', component: ReportsComponent, canActivate: [PermissionAccessGuard]}
];
