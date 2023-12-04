import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { NzxStorageService } from '@xmagic/nzx-antd/service';

import { UserInfo } from './user-info';

export const TOKEN_KEY = 'AUTH_TOKEN';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userInfoObservable?: Observable<UserInfo>;

  constructor(
    private http: HttpClient,
    protected storageService: NzxStorageService
  ) {}

  /**
   * 获取用户信息
   */
  getUserInfo(): Observable<UserInfo> {
    if (this.userInfoObservable) {
      return this.userInfoObservable;
    }
    this.userInfoObservable = this.http.get<UserInfo>('/system/user').pipe(shareReplay(1));
    return this.userInfoObservable;
  }

  /**
   * 退出登录
   */
  logout(): Observable<void> {
    return this.http.post<void>('/logout', null).pipe(finalize(() => this.removeToken()));
  }

  /**
   * 清空用户信息
   */
  clearUserInfo(): void {
    this.userInfoObservable = undefined;
  }

  /**
   * 获取token
   */
  getToken(): string | null {
    return this.storageService.getItem<string>(TOKEN_KEY);
  }

  /**
   * 删除token
   */
  removeToken(): void {
    this.storageService.removeItem(TOKEN_KEY);
  }
}
