import { Injectable } from '@angular/core';
import {
  NzxAntdService,
  ResponseSetting,
  TableSetting,
} from '@xmagic/nzx-antd';

import { HttpRequest } from '@angular/common/http';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { Constant } from '@commons/constant';
import { NzxStorageService } from '@xmagic/nzx-antd/service';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NzxAntdConfigService extends NzxAntdService {
  override basePath = environment.basePath;

  override response: ResponseSetting = {
    data: 'data',
    timeout: (error) => error.code === 402,
  };

  override table: TableSetting = {
    method: 'post',
    listField: 'list',
    totalField: 'total',
  };

  constructor(private storageService: NzxStorageService) {
    super();
  }

  override handleRequest = (req: HttpRequest<NzSafeAny>, url: string) => {
    const token = this.storageService.getItem<string>(Constant.AUTH_TOKEN_KEY);
    return token ? { setHeaders: { token } } : null;
  };
}
