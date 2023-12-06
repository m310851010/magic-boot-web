import { Route } from '@angular/router';

export default [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard-routing') }
] as Route[];
