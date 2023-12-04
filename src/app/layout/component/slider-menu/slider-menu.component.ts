import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppInfo, Menu } from '@commons/service/user-info';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'np-slider-menu',
  templateUrl: './slider-menu.component.html',
  styleUrls: ['./slider-menu.component.less']
})
export class SliderMenuComponent implements OnInit, OnDestroy {
  /**
   * 菜单是否展开
   */
  @Input() isCollapsed!: boolean;
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
  constructor(protected layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.switchAppEvent.pipe(takeUntil(this.destroy$)).subscribe(v => (this.selected = v));
  }

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    const prefix = this.selected?.pathPrefix;
    if (prefix && menuItem.url && menuItem.url.indexOf(prefix) === -1) {
      menuItem.url = `${prefix}#${menuItem.url}`;
    }
    this.menuClick.emit(menuItem);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
