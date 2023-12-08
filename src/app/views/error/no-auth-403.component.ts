import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzResultModule } from 'ng-zorro-antd/result';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'ma-no-auth-403',
  standalone: true,
  imports: [CommonModule, NzResultModule, NzButtonModule],
  template: `
    <nz-result nzStatus="403" nzSubTitle="抱歉，您没有权限访问该页面" nzTitle="403">
      <div nz-result-extra>
        <button nz-button nzType="primary" (click)="history.back()">返回</button>
      </div>
    </nz-result>
  `
})
export class NoAuth403Component {
  protected readonly history = history;
}
