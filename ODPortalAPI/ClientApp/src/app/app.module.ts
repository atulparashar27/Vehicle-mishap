import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';


import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UtilsService, AlertService, LocalStorage } from './utils/services/util.service';
import { LoginService } from './utils/services/login/login.service';
import { AttendanceService } from './utils/services/attendance/attendance.service';
import { DataManagmentService } from './utils/services/datamanagment/datamanagment.service';

import { OnlyLoggedInUsersGuard } from './utils/services/authGuard.service';
import { ProfileService } from './utils/services/profile/profile.service';
import { PermissionAccessGuard } from './utils/services/guards/permission.service';
import { UserPermissionService } from './utils/services/guards/userPermission.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgbModule, NgbActiveModal, NgbModalConfig, NgbDateAdapter, NgbDateParserFormatter  } from '@ng-bootstrap/ng-bootstrap';
import { NgbCustomAdapterService } from './utils/services/ngbCustomDates/ngb-custom-adapter.service';
import { NgbCustomDateParserFormatterService } from './utils/services/ngbCustomDates/ngb-custom-date-parser-formatter.service';
import { LoginComponent } from './login/login.component';
import { SavedAttendanceComponent } from './pages/saved-attendance/saved-attendance.component';
import { AgGridModule } from 'ag-grid-angular';
import { ReportsService } from './utils/services/reports/reports.service';
import { MiscService } from './utils/services/misc/misc.service';



@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    SavedAttendanceComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule.forRoot(AppRoutes,
    {
      useHash: true,
      relativeLinkResolution: 'legacy'
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule,
    NgxSpinnerModule,
    NgbModule,
    AgGridModule.withComponents([]),
  ],
  providers: [UtilsService, AlertService, LocalStorage, LoginService, AttendanceService, DataManagmentService,
     OnlyLoggedInUsersGuard, ProfileService, PermissionAccessGuard, UserPermissionService, NgbActiveModal, NgbModalConfig,
     {provide: NgbDateAdapter, useClass: NgbCustomAdapterService}, ReportsService, MiscService,
     {provide: NgbDateParserFormatter, useClass: NgbCustomDateParserFormatterService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
