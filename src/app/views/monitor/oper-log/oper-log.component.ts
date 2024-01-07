import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyFieldBetweenDatetimeModule } from '@xmagic/nz-formly/between-datetime';
import { FormlyFieldBetweenInputModule } from '@xmagic/nz-formly/between-input';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxColumn, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';

import { FormSearchComponent } from '@commons/component/form-search';

@Component({
  selector: 'ma-oper-log',
  standalone: true,
  imports: [
    CommonModule,
    FormSearchComponent,
    FormlyModule,
    NzFormlyModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzInputModule,
    FormlyFieldBetweenInputModule,
    FormlyFieldBetweenDatetimeModule,
    ReactiveFormsModule,
    NzFormModule,
    NzxTableModule,
    NzxLayoutPageModule
  ],
  templateUrl: './oper-log.component.html',
  styleUrl: './oper-log.component.less'
})
export default class OperLogComponent {
  gridOptions = { nzGutter: 15, colNzSpan: 8, labelNzFlex: '80px' };
  collapsed = true;

  searchForm = new FormGroup({});
  searchModel: Partial<OperLog> = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'row',
      fieldGroup: [
        {
          type: 'input',
          key: 'username',
          props: {
            label: '操作人'
          }
        },
        {
          type: 'input',
          key: 'userIp',
          props: {
            label: 'IP'
          }
        },
        {
          type: 'input',
          key: 'apiName',
          props: {
            label: '接口名'
          }
        },
        {
          type: 'input',
          key: 'apiPath',
          props: {
            label: '路径'
          },
          expressions: {
            hide: () => this.collapsed
          }
        },
        {
          type: 'between-input',
          key: 'costTime',
          props: {
            label: '耗时区间',
            nzxType: 'number'
          },
          expressions: {
            hide: () => this.collapsed
          }
        },
        {
          type: 'between-datetime',
          key: 'createDate',
          props: {
            label: '操作时间',
            nzShowTime: true
          },
          expressions: {
            hide: () => this.collapsed
          }
        }
      ]
    }
  ];

  getParams: () => Partial<OperLog> = () => this.searchModel;
  columns: NzxColumn<OperLog>[] = [
    { isIndex: true },
    {
      name: 'apiName',
      thText: '接口名'
    },
    {
      name: 'apiPath',
      thText: '路径'
    },
    {
      name: 'apiMethod',
      thText: '方法',
      nzWidth: '100px'
    },
    {
      name: 'userIp',
      thText: 'ip',
      nzWidth: '150px'
    },
    {
      name: 'costTime',
      thText: '耗时',
      nzWidth: '100px'
    },
    {
      name: 'userAgent',
      thText: '用户代理',
      nzWidth: '300px',
      nzEllipsis: true
    },
    {
      name: 'username',
      thText: '操作人',
      nzWidth: '150px'
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

interface OperLog {
  id: string;
  apiName: string;
  apiPath: string;
  apiMethod: string;
  costTime: string;
  createBy: string;
  createDate: string;
  userAgent: string;
  userIp: string;
}
