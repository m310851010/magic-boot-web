import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ma-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.less'
})
export default class UserComponent {}
