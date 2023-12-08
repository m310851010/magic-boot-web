import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'ma-not-found-404',
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule, NzButtonModule],
  template: `
    <nz-result nzStatus="404" nzSubTitle="抱歉，您访问的页面不存在" nzTitle="404">
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="history.back()">返回</button>
      </div>
    </nz-result>
  `
})
export class NotFound404Component {
  protected readonly history = history;
}
