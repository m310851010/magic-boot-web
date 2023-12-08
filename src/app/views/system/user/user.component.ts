import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzField, NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormlyNzButtonModule } from '@xmagic/nz-formly/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';

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
    NzSpaceModule
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
}
