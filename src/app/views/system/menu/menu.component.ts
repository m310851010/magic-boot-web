import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { FormsModule } from '@angular/forms';
import { NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'ma-menu',
  standalone: true,
  imports: [CommonModule, NzFormModule, NzCardModule, NzInputModule, FormsModule, NzTreeModule, NzButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export default class MenuComponent {
  searchText = '';
  nodes: NzTreeNodeOptions[] = [
    {
      title: 'parent 1',
      key: '100',
      children: [
        {
          title: 'parent 1-0',
          key: '1001',
          disabled: true,
          children: [
            { title: 'leaf 1-0-0', key: '10010', disableCheckbox: true, isLeaf: true },
            { title: 'leaf 1-0-1', key: '10011', isLeaf: true }
          ]
        },
        {
          title: 'parent 1-1',
          key: '1002',
          children: [
            { title: 'leaf 1-1-0', key: '10020', isLeaf: true },
            { title: 'leaf 1-1-1', key: '10021', isLeaf: true }
          ]
        }
      ]
    }
  ];
}
