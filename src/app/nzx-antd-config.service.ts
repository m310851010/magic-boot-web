import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

import { DEFAULT_STATUS_MESSAGE_MAP, NzxAntdService, ResponseSetting, TableSetting } from '@xmagic/nzx-antd';
import { HttpRequestOptions } from '@xmagic/nzx-antd/nzx-antd.service';
import { NzxStorageService } from '@xmagic/nzx-antd/service';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzMessageService } from 'ng-zorro-antd/message';

import { Constant } from '@commons/constant';

import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NzxAntdConfigService extends NzxAntdService {
  override basePath = environment.basePath;

  override response: ResponseSetting = {
    data: 'data',
    timeout: error => error.code === 402,
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
    private storageService: NzxStorageService,
    private messageService: NzMessageService
  ) {
    super();
  }

  override handleRequest = (req: HttpRequest<NzSafeAny>, url: string): null | HttpRequestOptions => {
    const token = this.storageService.getItem<string>(Constant.AUTH_TOKEN_KEY);
    return token ? { setHeaders: { token } } : null;
  };
}
