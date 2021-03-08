import { Component, OnInit } from '@angular/core';
import { LoginService } from 'app/utils/services/login/login.service';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    menuCode: number;
}

export const ROUTES: RouteInfo[] = [
    { path: '/profile', title: 'Manage Profile', icon: 'nc-icon nc-single-02', class: '', menuCode: 1 },
    { path: '/familyDetails', title: 'Manage Family Details', icon: 'fa fa-users', class: '', menuCode: 2 },
    { path: '/resetPassword', title: 'Reset Password', icon: 'nc-icon nc-key-25', class: '', menuCode: 3 },
    { path: '/attendance', title: 'Attendance', icon: 'nc-icon nc-ruler-pencil', class: '', menuCode: 4 },
    { path: '/manageActivities', title: 'Manage Activities', icon: 'nc-icon nc-tile-56', class: '', menuCode: 7 },
    { path: '/managePermissions', title: 'Manage Permissions', icon: 'nc-icon nc-money-coins', class: '', menuCode: 8 },
    { path: '/manageBranchDetails', title: 'Manage Branch Details', icon: 'nc-icon nc-badge', class: '', menuCode: 8 },
    { path: '/reports', title: 'Reports', icon: 'nc-icon nc-glasses-2', class: '', menuCode: 10 },
    { path: '/misc', title: 'Misc.', icon: 'nc-icon nc-zoom-split', class: '', menuCode: 10 }
    // { path: '/icons', title: 'Icons', icon: 'nc-icon nc-ruler-pencil', class: '', menuCode: 1 },
    // { path: '/maps', title: 'Maps', icon: 'nc-icon nc-pin-3', class: '', menuCode: 1 },
    // { path: '/notifications', title: 'Notifications', icon: 'nc-icon nc-bell-55', class: '', menuCode: 1 },
    // { path: '/table', title: 'Table List', icon: 'nc-icon nc-tile-56', class: '' },
    // { path: '/typography', title: 'Typography', icon: 'nc-icon nc-caps-small', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO', icon: 'nc-icon nc-badge', class: 'active-pro', menuCode: 1 },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    username = '';
    roles = [];
    constructor(private loginService: LoginService) {}
    ngOnInit() {
        this.username = this.loginService.getUserloggedIn().userName;
        this.roles = this.loginService.getUserRoleId();
        this.menuItems = ROUTES.filter(menuItem => this.roles.includes(menuItem.menuCode));
    }

    logOut() {
        this.loginService.logOutUser();
    }

    hideOrShow() {
        const liIds = document.getElementById('components');
        liIds.classList.toggle('show');
    }
}
