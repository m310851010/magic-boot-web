import { Route } from '@angular/router';

import { loadRemoteModule } from '@angular-architects/native-federation';
import { RouteData } from '@commons';

export default [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'mfe1',
    loadComponent: () =>
      loadRemoteModule({
        remoteEntry: `${window.environment.pluginPathAi}/remoteEntry.json`,
        remoteName: 'chat-ai-plugin',
        exposedModule: './Component'
      }).then(m => m.AppComponent),
    data: { ignore: true } as RouteData
  },
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
    data: { ignore: true } as RouteData
  }
] as Route[];
