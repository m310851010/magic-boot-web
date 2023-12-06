import { Component, HostListener, Input, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzOptionSelectionChange } from 'ng-zorro-antd/auto-complete';

import { Menu } from '@commons/service/user-info';

@Component({
  selector: 'np-header-menu-search',
  templateUrl: './header-menu-search.component.html',
  styleUrls: ['./header-menu-search.component.less'],
  host: {
    '[class.header-action-item]': 'true',
    '[class.clear-hover]': 'clearHoverSearch'
  }
})
export class HeaderMenuSearchComponent implements OnInit, OnChanges {
  @Input() menus!: Menu[];
  inputValue = '';
  /**
   * 隐藏搜索框
   */
  hiddenSearch = true;
  /**
   * 是否清除搜索图标的hover样式
   */
  clearHoverSearch = false;
  menuDataSource: Menu[] = [];
  autoOptions: Menu[] = [];

  constructor(protected router: Router) {}

  ngOnInit(): void {
    this.getMenuList();
  }

  getMenuList(): void {
    NzxUtils.forEachTree(this.menus, item => {
      if (!item.children || !item.children.length) {
        this.menuDataSource.push(item);
      }
      return true;
    });

    this.autoOptions = this.menuDataSource;
  }

  @HostListener('click')
  hiddenSearchInput(): void {
    this.hiddenSearch = !this.hiddenSearch;
    if (this.hiddenSearch) {
      setTimeout(() => (this.clearHoverSearch = false), 500);
    } else {
      this.clearHoverSearch = true;
    }
  }

  inputValueChange(value: string): void {
    if (value == null || value.trim() === '') {
      this.autoOptions = this.menuDataSource;
      return;
    }
    value = value.toLocaleLowerCase();
    this.autoOptions = this.menuDataSource.filter(item => item.name.toLocaleLowerCase().indexOf(value) >= 0);
  }

  searchMenu(item: Menu, key: string): boolean {
    return NzxUtils.isEmpty(key) ? true : item.name.indexOf(key) >= 0;
  }

  onSelectionChange(evt: NzOptionSelectionChange, menu: Menu): void {
    if (evt.isUserInput) {
      this.router.navigateByUrl(menu.url);
    }
  }

  ngOnChanges(changes: { [K in keyof this]?: SimpleChange } & SimpleChanges): void {
    if (changes.menus && !changes.menus.isFirstChange()) {
      this.getMenuList();
    }
  }
}
