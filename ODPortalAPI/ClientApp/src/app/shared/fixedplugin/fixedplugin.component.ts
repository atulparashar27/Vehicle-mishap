import { Component, OnInit } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'fixedplugin-cmp',
  templateUrl: 'fixedplugin.component.html'
})

export class FixedPluginComponent implements OnInit {

  public sidebarColor: string = 'black';
  public sidebarActiveColor: string = 'primary';

  public state: boolean = true;

  changeSidebarColor(color) {
    const sidebar = <HTMLElement>document.querySelector('.sidebar')
    const sidebarWrap = <HTMLElement>document.querySelector('.sidebar-wrapper');
    // const mainBar = <HTMLElement>document.querySelector('.main-panel');
    // mainBar.style.backgroundColor = 'white';
    this.sidebarColor = color;
    if (sidebar !== undefined) {
      sidebarWrap.style.backgroundColor = this.sidebarColor === 'black' ? 'RGB(52,58,64)' : 'white';
      sidebar.setAttribute('data-color', color);
    }
  }
  changeSidebarActiveColor(color) {
    const sidebar = <HTMLElement>document.querySelector('.sidebar');
    this.sidebarActiveColor = color;
    if (sidebar !== undefined) {
      sidebar.setAttribute('data-active-color', color);
    }
  }
  ngOnInit() {
    this.changeSidebarColor(this.sidebarColor);
    this.changeSidebarActiveColor(this.sidebarActiveColor);
   }
}
