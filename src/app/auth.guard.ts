import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { first, firstValueFrom, map, tap } from 'rxjs';

import { NzxAntdService } from '@xmagic/nzx-antd';

import { UserService } from '@commons/service/user.service';
import { MenuInfoService } from '@commons/service/menu-info.service';
import { NzxUtils } from '@xmagic/nzx-antd/util';

export const loginGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  if (userService.isLogin()) {
    return true;
  }
  return inject(Router).parseUrl('/login');
};

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  let route = childRoute;
  while (route.firstChild) {
    route = route.firstChild;
  }

  const ignoreAuth = route.data['ignore'];
  if (ignoreAuth) {
    return true;
  }
  const menuService = inject(MenuInfoService);
  const router = inject(Router);
  let isAuth = false;
  return menuService
    .getMenus()
    .pipe(first())
    .pipe(
      map(menus => {
        NzxUtils.forEachTree(menus, m => {
          if (m.url === state.url) {
            isAuth = true;
            return false;
          }
          return true;
        });

        if (!isAuth) {
          const prefix = state.url.indexOf('/main/') === 0 ? '/main' : '';
          router.navigate([prefix + '/error/403'], { skipLocationChange: true }).then();
        }
        return isAuth;
      })
    );
};
