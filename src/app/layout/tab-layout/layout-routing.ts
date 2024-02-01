import { Routes } from '@angular/router';
import { TabLayoutComponent } from './tab-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: TabLayoutComponent,
    loadChildren: () => import('../../views/views-routing')
  }
];
