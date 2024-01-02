import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'ma-druid',
  standalone: true,
  imports: [CommonModule, NzxPipeModule],
  template: `
    <iframe [src]="url | trustUrl" width="100%" height="100%" frameborder="0" style="padding: 0; margin: 0"></iframe>
  `,
  host: {
    '[class.full-size]': 'true',
    style: `display: block; overflow: hidden`
  }
})
export default class DruidComponent {
  url = `${environment.basePath}/druid/index.html`;
  constructor() {}
}
