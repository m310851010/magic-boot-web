import { Routes } from '@angular/router';

import { loginGuard, authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: () => import('./views/login/login-routing') },
  {
    path: 'main',
    canActivate: [loginGuard],
    canActivateChild: [authGuard],
    loadChildren: () => import('./layout/layout.module').then(m => m.LayoutModule)
  },
  {
    path: '**',
    loadComponent: () => import('./views/error/not-found-404.component').then(m => m.NotFound404Component)
  }
];
