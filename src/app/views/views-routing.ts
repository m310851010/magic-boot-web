import { Route } from '@angular/router';

export default [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  // { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-routing') },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component') },
  { path: 'error', loadChildren: () => import('./error/error-routing') },
  { path: 'system', loadChildren: () => import('./system/system-routing') }
] as Route[];
