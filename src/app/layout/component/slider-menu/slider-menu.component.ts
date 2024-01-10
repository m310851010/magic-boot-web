import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AppInfo, Menu } from '@commons/service';

@Component({
  selector: 'ma-slider-menu',
  templateUrl: './slider-menu.component.html',
  styleUrls: ['./slider-menu.component.less']
})
export class SliderMenuComponent implements OnInit, OnDestroy {
  /**
   * 菜单是否展开
   */
  @Input() isCollapsed!: boolean;
  @Input() menus!: Menu[];
  /**
   * 菜单点击事件
   */
  @Output() menuClick = new EventEmitter<Menu>();
  /**
   * 当前选中的应用
   */
  selected?: AppInfo;
  /**
   * 触发销毁Observable
   * @private
   */
  private destroy$ = new Subject<void>();
  constructor(protected router: Router) {}

  ngOnInit(): void {}

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    this.menuClick.emit(menuItem);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
