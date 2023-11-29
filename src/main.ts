import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NzxUtils } from '@xmagic/nzx-antd/util';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);

// @ts-ignore
Date.prototype.toJSON = function () {
  return this.getTime();
};
