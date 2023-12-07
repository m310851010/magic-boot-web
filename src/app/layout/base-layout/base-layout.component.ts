import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NzResizeEvent } from 'ng-zorro-antd/resizable';

import { MenuInfoService } from '@commons/service/menu-info.service';
import { Menu } from '@commons/service/user-info';

import { UpdatePasswordService } from '../component/update-password/update-password.service';

@Component({
  selector: 'np-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.less', './../layout.component.less'],
  providers: [UpdatePasswordService]
})
export class BaseLayoutComponent implements OnInit, OnDestroy {
  sliderWidth = 220;
  /**
   * 是否展开
   */
  isCollapsed = false;
  /**
   * 所有菜单
   */
  menus: Menu[] = [];

  @Output() menuClick = new EventEmitter<Menu>();
  private destroy$ = new Subject<void>();

  constructor(
    private menuService: MenuInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.getMenus().subscribe(menus => (this.menus = menus));
  }

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    this.menuClick.emit(menuItem);
  }

  onResize({ width, height }: NzResizeEvent): void {
    this.sliderWidth = width!;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.menuService.clearCache();
  }
}
