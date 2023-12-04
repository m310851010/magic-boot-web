import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./views/login/login-routing') },
  { path: 'main', loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule) }
];
