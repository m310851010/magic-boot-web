import { Route } from '@angular/router';

import { RouteData } from '@commons';

export default [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component'),
    data: { ignore: true } as RouteData
  },
  { path: 'error', loadChildren: () => import('./error/error-routing') },
  { path: 'system', loadChildren: () => import('./system/system-routing') },
  { path: 'monitor', loadChildren: () => import('./monitor/monitor-routing') },
  {
    path: '**',
    loadComponent: () => import('./error/not-found-404.component').then(m => m.NotFound404Component),
    title: '404',
    data: { ignore: true }
  }
] as Route[];
