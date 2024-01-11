import { bootstrapApplication } from '@angular/platform-browser';

import { NzxUtils } from '@xmagic/nzx-antd/util';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

bootstrapApplication(AppComponent, appConfig).catch(err => console.error(err));

Date.prototype.toJSON = function () {
  return NzxUtils.formatDate(this, 'yyyy-MM-dd HH:mm:ss');
};
