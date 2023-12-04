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
    const { username: u, verifyCode: v, rememberMe: m } = loginModel;
    const randoms = this.getRandoms(loginModel.captchaToken);
    const sp = sm3(loginModel.password);
    return this.http
      .post<string>(
        '/login',
        {
          u,
          v,
          m,
          p: sm3(sp + randoms[0]),
          s: sm3(`${u}|${sp}|${m}|${randoms[1]}|post`)
        },
        { context: new HttpContext().set(LOADING_ENABLED, false) }
      )
      .pipe(
        tap(token => {
          this.storageService.setItem(TOKEN_KEY, token);
        })
      );
  }

  private getRandoms(token?: string): string[] {
    const idx = token?.indexOf('l');
    if (idx == null || idx === -1) {
      return [];
    }
    return [token!.substring(0, idx), token!.substring(idx! + 1)];
  }

  /**
   * 获取验证码
   */
  getCaptcha(): Observable<CaptchaInfo> {
    return this.http
      .get('/verifyCode.jpg', {
        observe: 'response',
        responseType: 'blob',
        context: new HttpContext().set(LOADING_ENABLED, false)
      })
      .pipe(
        filter(v => !!v.body),
        switchMap(resp => {
          return new Observable<CaptchaInfo>(subscriber => {
            const reader = new FileReader();
            reader.onload = () => {
              const captchaToken = resp.headers.get('token');
              const captcha = reader.result;
              subscriber.next({ captchaToken, captcha } as CaptchaInfo);
              subscriber.complete();
            };
            reader.readAsDataURL(resp.body!);
          });
        })
      );
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
  /**
   * 记住密码
   */
  rememberMe: boolean;
}

/**
 * 验证码信息
 */
export interface CaptchaInfo {
  /**
   * 验证码token
   */
  captchaToken: string;
  /**
   * 验证码
   */
  captcha: string;
}
