import { Route } from '@angular/router';

export default [
  {
    path: '403',
    loadComponent: () => import('./no-auth-403.component').then(m => m.NoAuth403Component),
    data: { ignore: true }
  },
  {
    path: '404',
    loadComponent: () => import('./not-found-404.component').then(m => m.NotFound404Component),
    data: { ignore: true }
  }
] as Route[];
