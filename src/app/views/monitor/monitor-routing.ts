import { Route } from '@angular/router';

export default [
  { path: 'druid', loadComponent: () => import('./druid/druid.component') },
  { path: 'login-log', loadComponent: () => import('./login-log/login-log.component') },
  { path: 'online-user', loadComponent: () => import('./online-user/online-user.component') },
  { path: 'oper-log', loadComponent: () => import('./oper-log/oper-log.component') }
] as Route[];
