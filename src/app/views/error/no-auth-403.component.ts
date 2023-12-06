import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'ma-no-auth-403',
  standalone: true,
  imports: [CommonModule, NzResultModule],
  template: `
    <nz-result nzStatus="403" nzSubTitle="抱歉，您没有权限访问该页面" nzTitle="403"></nz-result>
  `
})
export class NoAuth403Component {}
