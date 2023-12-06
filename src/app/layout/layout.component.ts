import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MenuInfoService } from '@commons/service/menu-info.service';
import { Menu } from '@commons/service/user-info';

import { LayoutService } from './component/layout.service';

@Component({
  selector: 'ma-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export class LayoutComponent implements OnInit {
  pathTraces: Menu[] = [];

  constructor(
    private layoutService: LayoutService,
    private menuService: MenuInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    this.menuService.getMenus().subscribe(menus => {
      const result = this.layoutService.findPath(menus, menuItem.id);
      this.pathTraces = result || [];
      if (result) {
        this.router.navigateByUrl(menuItem.url);
      }
    });
  }
}
