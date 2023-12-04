import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { NzResizeEvent } from 'ng-zorro-antd/resizable';

import { AppInfo, Menu } from '@commons/service/user-info';

import { LayoutService } from '../component/layout.service';
import { MenuInfoService } from '../component/menu-info.service';
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
   * 所有应用
   */
  appInfos: AppInfo[] = [];

  @Output() menuClick = new EventEmitter<Menu>();
  private destroy$ = new Subject<void>();

  constructor(
    protected menuService: MenuInfoService,
    protected layoutService: LayoutService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.menuService.getMenus().subscribe(v => {
      if (v) {
        // @ts-ignore
        v = [{ menus: v, appCode: 'default' }];
        this.appInfos = v;
        this.layoutService.setAppList(v);
        this.layoutService.switchAppChange(v[0]);
      }
    });
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
    this.layoutService.destroy();
  }
}
