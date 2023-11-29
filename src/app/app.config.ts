import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';

import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';
import { NzxModalModule } from '@xmagic/nzx-antd/modal';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxAntdConfigService } from './nzx-antd-config.service';
import { NzxAntdService } from '@xmagic/nzx-antd';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAnimations(),
    importProvidersFrom(NzxModalModule, NzxHttpInterceptorModule),
    provideHttpClient(withInterceptorsFromDi()),
    NzxAntdConfigService,
    { provide: NzxAntdService, useExisting: NzxAntdConfigService },
  ],
};
