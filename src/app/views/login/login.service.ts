import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LOADING_ENABLED, NzxStorageService } from '@xmagic/nzx-antd/service';
// @ts-ignore
import { sm3 } from 'sm-crypto';

import { TOKEN_KEY } from '@commons/service/user.service';

@Injectable()
export class LoginService {
  constructor(
    protected http: HttpClient,
    protected storageService: NzxStorageService
  ) {}

  /**
   * 登录
   * @param loginModel 登录数据
   */
  login(loginModel: LoginModel): Observable<string> {
    const { username, verifyCode, uuid } = loginModel;
    const password = sm3(loginModel.password);
    return this.http
      .post<string>(
        '/system/security/login',
        {
          username,
          code: verifyCode,
          uuid,
          password
        },
        { context: new HttpContext().set(LOADING_ENABLED, false) }
      )
      .pipe(
        tap(token => {
          this.storageService.setItem(TOKEN_KEY, token);
        })
      );
  }

  /**
   * 获取验证码
   */
  getCaptcha(): Observable<CaptchaInfo> {
    return this.http.get<CaptchaInfo>('/system/security/verification/code', {
      context: new HttpContext().set(LOADING_ENABLED, false)
    });
  }
}

/**
 * 登录数据模型
 */
export interface LoginModel extends CaptchaInfo {
  /**
   * 用户名
   */
  username: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 验证码
   */
  verifyCode: string;
}

/**
 * 验证码信息
 */
export interface CaptchaInfo {
  /**
   * uuid 唯一标识
   */
  uuid: string;
  /**
   * 验证码
   */
  img: string;
}
