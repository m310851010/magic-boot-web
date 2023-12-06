import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ma-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export default class DashboardComponent {}
