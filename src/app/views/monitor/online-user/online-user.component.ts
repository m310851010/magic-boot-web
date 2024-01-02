import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyFieldBetweenDatetimeModule } from '@xmagic/nz-formly/between-datetime';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxColumn, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';

import { FormSearchComponent } from '@commons/component/form-search';

@Component({
  selector: 'ma-online-user',
  standalone: true,
  imports: [
    CommonModule,
    FormSearchComponent,
    NzFormlyModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzInputModule,
    FormlyFieldBetweenDatetimeModule,
    FormlyModule,
    ReactiveFormsModule,
    NzFormModule,
    NzxTableModule,
    NzxLayoutPageModule
  ],
  templateUrl: './online-user.component.html',
  styleUrl: './online-user.component.less'
})
export default class OnlineUserComponent {
  gridOptions = { nzGutter: 15, colNzSpan: 8, labelNzFlex: '80px' };
  collapsed = true;

  searchForm = new FormGroup({});
  searchModel: Partial<LoginLog> = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'row',
      fieldGroup: [
        {
          type: 'input',
          key: 'username',
          props: {
            label: '登录账号'
          }
        },
        {
          type: 'input',
          key: 'ip',
          props: {
            label: 'IP'
          }
        },
        {
          type: 'between-datetime',
          key: 'createDate',
          props: {
            label: '登录时间',
            nzShowTime: true
          },
          expressions: {
            hide: () => this.collapsed
          }
        }
      ]
    }
  ];

  getParams: () => Partial<LoginLog> = () => this.searchModel;
  columns: NzxColumn<LoginLog>[] = [
    { isIndex: true },
    {
      name: 'username',
      thText: '登录账号'
    },
    {
      name: 'failPassword',
      thText: '失败密码',
      nzEllipsis: true
    },
    {
      name: 'type',
      thText: '登录状态',
      nzWidth: '100px',
      tdTemplate: 'typeTemplate'
    },
    {
      name: 'address',
      thText: '登录地址'
    },
    {
      name: 'ip',
      thText: 'ip',
      nzWidth: '150px'
    },
    {
      name: 'browser',
      thText: '浏览器'
    },
    {
      name: 'os',
      thText: '系统',
      nzEllipsis: true
    },
    {
      name: 'createDate',
      thText: '操作时间',
      nzWidth: '170px'
    }
  ];

  onCollapsedChange(): void {
    this.searchFields = [...this.searchFields];
  }
}

interface LoginLog {
  id: string;
  username: string;
  failPassword: string;
  type: string;
  browser: string;
  os: string;
  address: string;
  ip: string;
  token: string;
  createDate: string;
}
