import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'ma-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export default class MenuComponent {}
