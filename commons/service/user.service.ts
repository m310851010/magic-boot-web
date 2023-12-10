import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NzxStorageService } from '@xmagic/nzx-antd/service';

import { UserInfo } from './user-info';
import { Constant } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfo$?: Observable<UserInfo>;

  constructor(
    private http: HttpClient,
    protected storageService: NzxStorageService
  ) {}

  /**
   * 获取用户信息
   */
  getUserInfo(): Observable<UserInfo> {
    if (this.userInfo$) {
      return this.userInfo$;
    }
    this.userInfo$ = this.http.get<UserInfo>('/system/user/info').pipe(shareReplay(1));
    return this.userInfo$;
  }

  /**
   * 退出登录
   */
  logout(): Observable<void> {
    return this.http.get<void>('/system/security/logout').pipe(finalize(() => this.clearCache()));
  }

  /**
   * 清空用户信息
   */
  clearUserInfo(): void {
    this.userInfo$ = undefined;
  }

  /**
   * 获取token
   */
  getToken(): string | null {
    const token = this.storageService.getItem<string>(Constant.AUTH_TOKEN_KEY);
    return token ? encodeURIComponent(token) : null;
  }

  /**
   * 是否已登录
   */
  isLogin(): boolean {
    return !!this.getToken();
  }

  /**
   * 删除token
   */
  clearCache(): void {
    this.storageService.removeItem(Constant.AUTH_TOKEN_KEY);
    this.clearUserInfo();
  }
}
