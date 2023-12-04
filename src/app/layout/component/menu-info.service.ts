import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { AppInfo } from '@commons/service/user-info';

@Injectable()
export class MenuInfoService {
  private menuObservable?: Observable<AppInfo[]>;

  constructor(protected http: HttpClient) {}

  /**
   * 获取菜单列表 并缓存
   * @param url 请求地址
   */
  getMenus(url: string = '/menus'): Observable<AppInfo[]> {
    if (this.menuObservable) {
      return this.menuObservable;
    }
    this.menuObservable = this.http.get<AppInfo[]>(url).pipe(shareReplay(1));
    return this.menuObservable;
  }

  /**
   * 清空缓存
   */
  clearCache() {
    this.menuObservable = undefined;
  }
}
