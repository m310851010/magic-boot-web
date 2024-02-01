import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () => import('../../views/views-routing')
  }
];
