import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxTableComponent } from '@xmagic/nzx-antd/table';
import { NzxColumnButton } from '@xmagic/nzx-antd/table/table.type';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private http: HttpClient,
    private modalService: NzxModalService,
    private messageService: NzMessageService
  ) {}

  /**
   * 删除
   * @param options
   */
  handleDelete<T = boolean>(options: {
    id: string | string[];
    url: string;
    params?: Record<string, any>;
    table?: NzxTableComponent;
    message?: string;
  }): Promise<T> {
    return new Promise((resolve, reject) => {
      this.modalService.confirm({
        nzContent: options.message || '删除后不可恢复，确定删除?',
        nzOnOk: () => {
          this.http
            .delete<T>(options.url, {
              params: {
                id: NzxUtils.isArray(options.id) ? options.id.join(',') : options.id,
                ...(options.params || {})
              }
            })
            .subscribe(result => {
              if (result) {
                if (options.table) {
                  options.table.refresh(false);
                }
                this.messageService.success('删除成功');
              } else {
                this.messageService.warning('该信息不存在或已被删除');
              }
              resolve(result);
            });
        }
      });
    });
  }
}

/**
 * 删除按钮
 */
export const DeleteButton: Partial<NzxColumnButton> = {
  text: '删除',
  ngClass: ['ant-btn-dangerous', 'ant-btn-link']
};
