import { Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';

import { NzContextMenuService, NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';

import { AppInfo, Menu } from '@commons/service';

import { CloseType, LayoutService, TabSetInfo } from '../layout.service';

@Component({
  selector: '[tab-contextmenu]',
  exportAs: 'tabContextmenu',
  templateUrl: './tab-contextmenu.component.html',
  styleUrls: ['./tab-contextmenu.component.less']
})
export class TabContextmenuComponent implements OnInit {
  /**
   * 右键当前tab
   */
  @Input() tab!: Menu;
  @Input() selected!: AppInfo;
  @Input() tabSetInfo!: TabSetInfo;
  @Output() refresh = new EventEmitter<Menu>();
  @ViewChild('menu') menu!: NzDropdownMenuComponent;
  constructor(
    protected nzContextMenuService: NzContextMenuService,
    protected layoutService: LayoutService
  ) {}

  ngOnInit(): void {}

  /**
   * 右键菜单
   * @param evt
   */
  @HostListener('contextmenu', ['$event'])
  contextMenuEventHandler(evt: MouseEvent): void {
    this.nzContextMenuService.create(evt, this.menu);
  }

  /**
   * 关闭右键菜单
   */
  closeContextMenu(): void {
    this.nzContextMenuService.close();
  }

  get canCloseOne(): boolean {
    return this.layoutService.tabCloseable(this.tab);
  }

  get canCloseLeft(): boolean {
    return !!this.layoutService.leftTabCloseable(this.tab, this.selected.appCode).length;
  }

  get canCloseRight(): boolean {
    return !!this.layoutService.rightTabCloseable(this.tab, this.selected.appCode).length;
  }

  get canCloseOther(): boolean {
    return !!this.layoutService.otherTabCloseable(this.tab, this.selected.appCode).length;
  }

  get canCloseAll(): boolean {
    return !!this.layoutService.allTabCloseable(this.selected.appCode).length;
  }

  closeTab(closeType: CloseType): void {
    this.layoutService.closeTab(this.tab, this.selected.appCode, closeType);
  }

  /**
   * 刷新页面
   */
  refreshTab(): void {
    this.refresh.next(this.tab);
    this.layoutService.refreshTab(this.tab, this.selected.appCode);
  }
}
