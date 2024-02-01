import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';

import { Menu } from './user-info';
import { NzxUtils } from '@xmagic/nzx-antd/util';

@Injectable({
  providedIn: 'root'
})
export class MenuInfoService {
  private menus$?: Observable<Menu[]>;

  constructor(protected http: HttpClient) {}

  /**
   * 获取菜单列表 并缓存
   * @param url 请求地址
   */
  getMenus(url: string = '/system/menu/current/menus'): Observable<Menu[]> {
    if (this.menus$) {
      return this.menus$;
    }
    this.menus$ = this.http.post<Menu[]>(url, {}).pipe(
      shareReplay(1),
      map(v => {
        NzxUtils.forEachTree(v, node => {
          if (node.url) node.url = node.url.replace(/^\/main\//, '/');
        });
        return v;
      })
    );
    return this.menus$;
  }

  /**
   * 清空缓存
   */
  clearCache(): void {
    this.menus$ = undefined;
  }
}
