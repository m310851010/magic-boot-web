import { EventEmitter, Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

import { NzxUtils } from '@xmagic/nzx-antd/util';

import { AppInfo, Menu } from '@commons/service';

@Injectable()
export class LayoutService {
  /**
   * 所有应用Map
   */
  appMap: { [key: string]: AppInfo } = {};
  /**
   * 标签页信息
   */
  tabMap: { [id: string]: TabSetInfo } = {};
  /**
   * 当前选中的引用
   */
  selected?: AppInfo;
  /**
   * 切换应用事件
   */
  switchAppEvent = new ReplaySubject<AppInfo>();
  /**
   * 应用列表变化事件, 初始化加载,或重新加载会触发
   */
  appListChangeEvent = new ReplaySubject<AppInfo[]>();
  /**
   * 打开标签事件
   */
  openTabEvent = new EventEmitter<{ index: number; tab: Menu }>();
  /**
   * 切换tab事件
   */
  switchTabEvent = new EventEmitter<{ index: number; tab: Menu }>();
  /**
   * 刷新Tab事件
   */
  refreshTabEvent = new EventEmitter<Menu>();
  /**
   * 关闭Tab事件
   */
  closeTabEvent = new EventEmitter<{ index: number; tab: Menu }>();

  constructor() {}

  setAppList(apps: AppInfo[]): void {
    if (!apps || !apps.length) {
      this.appMap = {};
      this.tabMap = {};
      this.appListChangeEvent.next([]);
      return;
    }

    apps.forEach(app => {
      this.appMap[app.appCode] = app;
      if (this.tabMap[app.appCode]) {
        return;
      }
      this.tabMap[app.appCode] = {
        selectedIndex: null,
        appCode: app.appCode,
        tabs: []
      };
    });
    this.appListChangeEvent.next(apps);
  }

  /**
   * 切换应用
   * @param app
   */
  switchAppChange(app: AppInfo): void {
    this.selected = app;
    this.switchAppEvent.next(app);
  }

  /**
   * 打开新标签页
   * @param  tab
   * @param appCode
   * @param forceOpen 强制展开菜单, 会展开当前选中菜单的所有父级菜单
   */
  openTab(tab: Menu, appCode: string, forceOpen: boolean = true): void {
    const tabSet = this.tabMap[appCode];
    if (!tabSet || !tab.url) {
      return;
    }

    if (this.selected?.appCode !== appCode) {
      this.selected = this.appMap[appCode];
      this.switchAppChange(this.selected);
    }

    this.setMenuSelected(appCode, tab);

    const index = tabSet.tabs.findIndex(v => v.id === tab.id);
    // 已经存在则直接切换到对应的tab
    if (index > -1) {
      NzxUtils.assign(tabSet.tabs[index], tab);
      tabSet.selectedIndex = index;
      this.switchTabEvent.next({ index, tab });
      return;
    }

    tab.url = this.getRandomUrl(tab.url);
    tabSet.tabs.push(tab);
    tabSet.selectedIndex = tabSet.tabs.length - 1;
    this.openTabEvent.next({ index: tabSet.selectedIndex, tab });

    if (forceOpen) {
      this.expandMenu(appCode, tab);
    }
  }

  /**
   * 刷新页面
   */
  refreshTab(tab: Menu, appCode: string): void {
    const frame = this.getIframe(appCode, tab.id);
    if (frame) {
      const url = frame.getAttribute('src')!;
      if (url) {
        this.refreshTabEvent.emit(tab);
        frame.setAttribute('src', this.getRandomUrl(url));
      }
    }
  }

  /**
   * 当前Tab是否可关闭
   * @param tab
   */
  tabCloseable(tab: Menu): boolean {
    return tab.closeable !== false;
  }

  /**
   * 获取左侧可关闭的Tab列表
   * @param tab
   * @param appCode
   */
  leftTabCloseable(tab: Menu, appCode: string): number[] {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return [];
    }

    const closeable: number[] = [];
    for (let i = 0; i < tabSetInfo.tabs.length; i++) {
      const it = tabSetInfo.tabs[i];
      if (tab.id === it.id) {
        return closeable;
      }
      if (it.closeable !== false) {
        closeable.push(i);
      }
    }
    return closeable;
  }

  /**
   * 获取右侧可关闭的tab列表
   * @param tab
   * @param appCode
   */
  rightTabCloseable(tab: Menu, appCode: string): number[] {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return [];
    }

    const closeable: number[] = [];
    for (let i = tabSetInfo.tabs.length - 1; i >= 0; i--) {
      const it = tabSetInfo.tabs[i];
      if (tab.id === it.id) {
        return closeable;
      }
      if (it.closeable !== false) {
        closeable.unshift(i);
      }
    }
    return closeable;
  }

  /**
   * 获取两侧侧可关闭的tab列表
   * @param tab
   * @param appCode
   */
  otherTabCloseable(tab: Menu, appCode: string): number[] {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return [];
    }

    const closeable: number[] = [];
    for (let i = 0; i < tabSetInfo.tabs.length; i++) {
      const it = tabSetInfo.tabs[i];
      if (tab.id === it.id) {
        continue;
      }
      if (it.closeable !== false) {
        closeable.push(i);
      }
    }
    return closeable;
  }

  /**
   * 获取所有可关闭的tab列表
   * @param appCode
   */
  allTabCloseable(appCode: string): number[] {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return [];
    }

    const closeable: number[] = [];
    for (let i = 0; i < tabSetInfo.tabs.length; i++) {
      const it = tabSetInfo.tabs[i];
      if (it.closeable !== false) {
        closeable.push(i);
      }
    }
    return closeable;
  }

  /**
   * 获取当前激活的Tab
   */
  getActiveTab(): Menu | null {
    if (!this.selected) {
      return null;
    }
    const tabSetInfo = this.tabMap[this.selected.appCode];
    if (!tabSetInfo) {
      return null;
    }
    if (tabSetInfo.selectedIndex == null) {
      return null;
    }
    return tabSetInfo.tabs[tabSetInfo.selectedIndex];
  }

  /**
   * 批量删除指定索引的标签页
   * @param index
   * @param appCode
   * @private
   */
  private deleteTab(index: number[], appCode: string): void {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return;
    }
    for (let i = index.length - 1; i >= 0; i--) {
      tabSetInfo.tabs.splice(index[i], 1);
    }
  }

  /**
   * 关闭Tab
   * @param tab
   * @param appCode
   * @param closeType 关闭类型
   */
  closeTab(tab: Menu, appCode: string, closeType: CloseType = 'one'): void {
    const tabSetInfo = this.tabMap[appCode];
    if (!tabSetInfo) {
      return;
    }

    const tabInfo: Menu[] = tabSetInfo.tabs;
    let thisTabIndex = tabInfo.findIndex(v => v.id === tab.id);
    if (thisTabIndex < 0) {
      return;
    }

    switch (closeType) {
      case 'one':
        tabInfo.splice(thisTabIndex, 1);
        break;

      case 'left':
        this.deleteTab(this.leftTabCloseable(tab, appCode), appCode);
        if (thisTabIndex === tabSetInfo.selectedIndex) {
          tabSetInfo.selectedIndex = 0;
        }
        thisTabIndex -= 1;
        break;

      case 'right':
        this.deleteTab(this.rightTabCloseable(tab, appCode), appCode);
        break;

      case 'other':
        this.deleteTab(this.otherTabCloseable(tab, appCode), appCode);
        break;

      case 'all':
        this.deleteTab(this.allTabCloseable(appCode), appCode);
    }

    if (tabSetInfo.selectedIndex === thisTabIndex && tabInfo[tabSetInfo.selectedIndex]?.closeable !== false) {
      const selectedIdx = tabSetInfo.tabs.length ? tabSetInfo.tabs.length - 1 : null;
      this.closeTabEvent.emit({ index: thisTabIndex, tab });
      this.selectedIndexChange(selectedIdx, appCode);
    }
  }

  /**
   * 当前tab改变事件
   * @param index 当前索引
   * @param appCode 应用编码
   */
  selectedIndexChange(index: number | null, appCode: string): void {
    const tabSet = this.tabMap[appCode];
    if (!tabSet) {
      return;
    }

    const tab = tabSet.tabs[index!];
    this.setMenuSelected(appCode, tab);
    tabSet.selectedIndex = index;

    if (tab) {
      this.switchTabEvent.next({ index: index!, tab });
      this.expandMenu(appCode, tab);
    }
  }

  /**
   * 获取指定系统下,指定tab key所在的索引
   * @param key tab key
   * @param appCode 应用编码
   */
  getTabIndex(key: string, appCode: string): number {
    const tabSet = this.tabMap[appCode];
    if (!tabSet) {
      return -1;
    }
    return tabSet.tabs.findIndex(v => v.id === key);
  }

  /**
   * 根据标签和应用编码获取iframe
   * @param tabId 标签Id
   * @param appCode 应用编码
   * @returns
   */
  getIframe(appCode: string, tabId: string): HTMLIFrameElement {
    return document.getElementById(`${appCode}__${tabId}`) as HTMLIFrameElement;
  }

  findPath(tree: Menu[], id: string, path: Menu[] = []): Menu[] | undefined {
    for (const item of tree) {
      const tempPath = [...path];
      item.selected = false;
      item.open = false;

      tempPath.push(item);
      if (item.id === id) {
        setTimeout(() => (item.selected = true));
        return tempPath;
      }
      if (item.children) {
        const result = this.findPath(item.children!, id, tempPath);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }

  findMenu(key: string, appCode: string): Menu[] | undefined {
    const app = this.appMap[appCode];
    return this.findPath(app.menus, key);
  }

  destroy(): void {
    this.appMap = {};
    this.tabMap = {};
    this.selected = undefined;
  }

  /**
   * 展开菜单
   * @param appCode
   * @param tab
   * @private
   */
  private expandMenu(appCode: string, tab: Menu): void {
    const app = this.appMap[appCode];

    // 处理选中的菜单
    const menus = app.menus;
    let found = false;
    const stack: Menu[] = [];

    NzxUtils.forEachTree<Menu>(menus, (item, _parentNode, level) => {
      if (level === 0) {
        stack.length = 0;
      }
      stack.push(item);
      found = item.id === tab.id;
      return !found;
    });

    if (found) {
      stack.forEach(it => (it.open = true));
    }
  }

  /**
   * 设置菜单选中状态并取消之前的菜单选中状态
   * @param menuItem
   * @param appCode
   * @private
   */
  private setMenuSelected(appCode: string, menuItem?: Menu): void {
    const app = this.appMap[appCode];
    if (app.prevMenu) {
      app.prevMenu.selected = false;
    }
    if (menuItem) {
      menuItem.selected = true;
    }
    app.prevMenu = menuItem;
  }

  /**
   * 根据URL来自动添加随机数,防止缓存
   * @param url 原始URL
   * @returns
   */
  getRandomUrl(url: string): string {
    const R = '__RDM__';
    const randomIndex = url.indexOf(R);
    const newRandom = `${Math.random()}`.replace('.', '');

    if (randomIndex !== -1) {
      return url.replace(/__RDM__=\d+/, `${R}=${newRandom}`);
    }

    const hashIndex = url.indexOf('#');
    if (hashIndex !== -1) {
      const beforeUrl = url.substring(0, hashIndex);
      return `${beforeUrl + (beforeUrl.indexOf('?') !== -1 ? '&' : '?') + R}=${newRandom}${url.substring(hashIndex)}`;
    }

    return `${url + (url.indexOf('?') === -1 ? '?' : '&') + R}=${newRandom}`;
  }
}

export type CloseType = 'one' | 'left' | 'right' | 'other' | 'all';

/**
 * 一个系统打开的标签
 */
export interface TabSetInfo {
  /**
   * 当前选中tab的索引
   */
  selectedIndex?: number | null;
  /**
   * 该系统下所有打开的标签列表
   */
  tabs: Menu[];
  /**
   * 应用编码
   */
  appCode: string;
}
