import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { InputTypeComponent } from '@commons/component/input-type/input-type.component';

@Component({
  selector: 'ma-dashboard',
  standalone: true,
  imports: [CommonModule, InputTypeComponent, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export default class DashboardComponent {
  value = null;

  onChange($event: any, t: any) {
    console.log('value', $event);
    console.log('t', t);
  }
}
