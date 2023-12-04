import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AppInfo, Menu } from '@commons/service/user-info';

import { LayoutService } from './component/layout.service';

@Component({
  selector: 'ma-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export class LayoutComponent {
  pathTraces: Menu[] = [];
  selected?: AppInfo;

  constructor(
    protected layoutService: LayoutService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.layoutService.switchAppEvent.subscribe(app => (this.selected = app));
  }

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    const { menu, trace } = this.layoutService.findMenu(menuItem.id, this.selected!.appCode);
    if (menu) {
      this.pathTraces = trace;
      this.router.navigate([`/home${menu.url}`]);
    }
  }
}
