import { Route } from '@angular/router';

export default [
  { path: 'dic', loadComponent: () => import('./dic/dic.component') },
  { path: 'menu', loadComponent: () => import('./menu/menu.component') },
  { path: 'user', loadComponent: () => import('./user/user.component') },
  { path: 'profile', loadComponent: () => import('./profile/profile.component'), data: { ignore: true } },
  { path: 'configure', loadComponent: () => import('./configure/configure.component') },
  { path: 'office', loadComponent: () => import('./office/office.component') },
  { path: 'role', loadComponent: () => import('./role/role.component') }
] as Route[];
