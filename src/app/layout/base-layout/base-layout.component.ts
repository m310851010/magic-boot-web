import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { first } from 'rxjs';

import { NzResizeEvent } from 'ng-zorro-antd/resizable';

import { Menu, MenuInfoService } from '@commons/service';

import { UpdatePasswordService } from '../component/update-password/update-password.service';

@Component({
  selector: 'ma-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.less', './../layout.component.less'],
  providers: [UpdatePasswordService]
})
export class BaseLayoutComponent implements OnInit {
  /**
   * 侧边菜单栏
   */
  @Input() leftSlider = true;
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

  constructor(private menuService: MenuInfoService) {}

  ngOnInit(): void {
    this.menuService
      .getMenus()
      .pipe(first())
      .subscribe(menus => (this.menus = menus));
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
}
