import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SavedAttendanceComponent } from './pages/saved-attendance/saved-attendance.component';
import { OnlyLoggedInUsersGuard } from './utils/services/authGuard.service';

export const AppRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'savedAttendance/:code/:date', component: SavedAttendanceComponent, canActivate: [OnlyLoggedInUsersGuard]},
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [OnlyLoggedInUsersGuard],
    children: [
      {
        path: '',
        loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
]
