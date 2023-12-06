import { Route } from '@angular/router';

import { DashboardComponent } from './dashboard.component';

export default [{ path: '', component: DashboardComponent, title: '首页', data: { auth: 'menu:save' } }] as Route[];
