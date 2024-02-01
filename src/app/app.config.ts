import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import zh from '@angular/common/locales/zh';
import { APP_INITIALIZER, ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Route, Router, withComponentInputBinding, withHashLocation } from '@angular/router';

import { NzxAntdService } from '@xmagic/nzx-antd';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxModalModule } from '@xmagic/nzx-antd/modal';
import { NZ_I18N, zh_CN } from 'ng-zorro-antd/i18n';

import { EnvService } from '@commons/service';

import { routes } from './app.routes';
import { NzxAntdConfigService } from './nzx-antd-config.service';
import { environment } from '../environments/environment';
import { authGuard, loginGuard } from './auth.guard';

registerLocaleData(zh);

declare const jQuery: any;

function registerLayout(router: Router, envService: EnvService) {
  return () => {
    const config = router.config.slice(0, router.config.length - 1);
    const last = router.config.at(-1)!;

    const loadChildren =
      envService.layout == 'tab'
        ? () => import('./layout/tab-layout/layout-routing').then(m => m.routes)
        : () => import('./layout/default-layout/layout-routing').then(m => m.routes);

    const layout: Route = {
      path: '',
      canActivate: [loginGuard],
      canActivateChild: [authGuard],
      loadChildren
    };
    router.resetConfig(config.concat([layout, last]));
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    provideRouter(routes, withHashLocation(), withComponentInputBinding()),
    provideAnimations(),
    importProvidersFrom(NzxModalModule, NzxHttpInterceptorModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: APP_INITIALIZER, useFactory: registerLayout, multi: true, deps: [Router, EnvService] },
    NzxAntdConfigService,
    { provide: EnvService, useValue: environment },
    { provide: NzxAntdService, useExisting: NzxAntdConfigService }
  ]
};
