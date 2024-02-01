import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { first, map } from 'rxjs';

import { NzxUtils } from '@xmagic/nzx-antd/util';

import { MenuInfoService, UserService } from '@commons/service';

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

  const { ignore, permission } = route.data;
  // 忽略权限校验
  if (ignore) {
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
        // 配置permission时优先使用permission对比
        if (permission) {
          NzxUtils.forEachTree(menus, m => {
            if (m.permission === permission) {
              isAuth = true;
              return false;
            }
            return true;
          });
        } else {
          NzxUtils.forEachTree(menus, m => {
            if (m.url === state.url) {
              isAuth = true;
              return false;
            }
            return true;
          });
        }

        if (!isAuth) {
          router.navigate([`/error/403`], { skipLocationChange: true }).then();
        }
        return isAuth;
      })
    );
};
