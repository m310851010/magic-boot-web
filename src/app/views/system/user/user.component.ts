import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzField, NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzButtonModule } from '@xmagic/nz-formly/button';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Component({
  selector: 'ma-user',
  standalone: true,
  imports: [
    CommonModule,
    NzxLayoutPageModule,
    ReactiveFormsModule,
    NzFormlyModule,
    FormlyNzInputModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzButtonModule,
    FormlyModule,
    NzFormModule,
    NzButtonModule,
    NzSpaceModule,
    NzCardModule,
    NzInputModule,
    NzTreeModule,
    FormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.less'
})
export default class UserComponent {
  gridOptions = { colNzMd: { span: 12 }, colNzXl: { span: 6 }, colNzXs: { span: 24 }, nzGutter: 15 };
  searchForm = new FormGroup({});
  searchModal = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'row',
      props: { nzGutter: 15 },
      fieldGroup: [
        {
          type: 'input',
          props: {
            label: '用户名',
            ...this.gridOptions
          }
        },
        {
          type: 'input',
          props: {
            label: '用户名',
            ...this.gridOptions
          }
        },
        {
          type: 'row',
          props: {
            nzGutter: 10
          },
          fieldGroup: [
            {
              type: 'button',
              props: {
                text: '查询',
                nzType: 'primary'
              }
            },
            {
              type: 'button',
              props: {
                text: '重置'
              }
            }
          ]
        }
      ]
    }
  ];

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
