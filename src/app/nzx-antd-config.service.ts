import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, map, Observable, throwError } from 'rxjs';

import { DEFAULT_STATUS_MESSAGE_MAP, NzxAntdService, ResponseSetting, TableSetting } from '@xmagic/nzx-antd';
import { HttpRequestOptions } from '@xmagic/nzx-antd/nzx-antd.service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { UserService } from '@commons/service';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NzxAntdConfigService extends NzxAntdService {
  override basePath = environment.basePath;

  // @ts-ignore
  override dic = {
    url: '/system/dict/children',
    map: (list: { label: string; value: string | number; dataType: 0 | 1; extJson?: string }[]) => {
      for (const item of list) {
        if (item.extJson) {
          Object.assign(item, JSON.parse(item.extJson));
          delete item.extJson;
        }
        if (item.dataType === 1) {
          item.value = +item.value;
        }
      }
      return list;
    }
  };

  override response: ResponseSetting = {
    data: 'data',
    timeout: error => {
      return error.code === 402;
    },
    handleError: (req, error) => {
      if (error.httpError) {
        this.messageService.error(DEFAULT_STATUS_MESSAGE_MAP[error.code] || DEFAULT_STATUS_MESSAGE_MAP['other']);
      } else if (error.code < 1024) {
        this.messageService.error(error.message);
      }
      return throwError(() => error);
    }
  };

  override table: TableSetting = {
    method: 'post',
    listField: 'list',
    totalField: 'total'
  };

  constructor(
    private messageService: NzMessageService,
    private userService: UserService
  ) {
    super();
  }

  override handleRequest = (req: HttpRequest<NzSafeAny>, url: string): null | HttpRequestOptions => {
    const Authorization = this.userService.getToken();
    return Authorization ? { setHeaders: { Authorization } } : null;
  };

  // @ts-ignore
  override hasAuth = (authCode: string): Observable<boolean> => {
    return this.userService.getUserInfo().pipe(
      first(),
      map(v => {
        const authorities = v.authorities || [];
        return authorities.indexOf(authCode) >= 0;
      })
    );
  };
}
