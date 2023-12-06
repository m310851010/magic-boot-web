import { Route } from '@angular/router';

export default [
  { path: 'dic', loadComponent: () => import('./dic/dic.component') },
  { path: 'menu', loadComponent: () => import('./menu/menu.component') },
  { path: 'user', loadComponent: () => import('./user/user.component') }
] as Route[];
