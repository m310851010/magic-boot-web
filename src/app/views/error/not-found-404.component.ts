import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'ma-not-found-404',
  standalone: true,
  imports: [CommonModule, NzResultModule],
  template: `
    <nz-result nzStatus="404" nzSubTitle="抱歉，您访问的页面不存在" nzTitle="404"></nz-result>
  `
})
export class NotFound404Component {}
