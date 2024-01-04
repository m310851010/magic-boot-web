import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'ma-profile',
  standalone: true,
  imports: [CommonModule, NzCardModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export default class ProfileComponent {}
