import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { map } from 'rxjs';

import { NzxAntdService } from '@xmagic/nzx-antd';

import { UserService } from '@commons/service/user.service';

import { NzxAntdConfigService } from './nzx-antd-config.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  console.log(`loginGuard==`);
  if (userService.isLogin()) {
    return true;
  }
  return inject(Router).parseUrl('/login');
};

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const authCode = childRoute.data['auth'];
  console.log(`authCode==${authCode}`);
  if (!authCode) {
    return true;
  }
  const configService = inject(NzxAntdService);
  const router = inject(Router);
  return configService.hasAuth!(authCode).pipe(
    map(v => {
      console.log('-----');
      return v ? true : router.parseUrl('/error/403');
    })
  );
};
