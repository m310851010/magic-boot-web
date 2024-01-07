import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyFieldBetweenDatetimeModule } from '@xmagic/nz-formly/between-datetime';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { NzxCheckboxModule } from '@xmagic/nzx-antd/checkbox';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { DicService } from '@xmagic/nzx-antd/service';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzAlertModule } from 'ng-zorro-antd/alert';
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
    NzxLayoutPageModule,
    NzAlertModule,
    NzxCheckboxModule,
    FormsModule
  ],
  templateUrl: './online-user.component.html',
  styleUrl: './online-user.component.less'
})
export default class OnlineUserComponent {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<{}>;
  @ViewChild('table') table!: NzxTableComponent<OnlineUser>;

  gridOptions = { nzGutter: 15, colNzSpan: 8, labelNzFlex: '80px' };
  collapsed = true;

  searchForm = new FormGroup({});
  searchModel: Partial<OnlineUser> = {};
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
          }
        }
      ]
    }
  ];

  noLoginTime$ = this.dicService.getDic('NO_LOGIN_TIME');

  getParams: () => Partial<OnlineUser> = () => this.searchModel;
  columns: NzxColumn<OnlineUser>[] = [
    { isIndex: true },
    {
      name: 'username',
      thText: '登录名称'
    },
    {
      name: 'officeName',
      thText: '所属机构'
    },
    {
      name: 'address',
      thText: '登录地址'
    },
    {
      name: 'ip',
      thText: 'IP'
    },
    {
      name: 'browser',
      thText: '浏览器'
    },
    {
      name: 'os',
      thText: '操作系统',
      nzEllipsis: true
    },
    {
      name: 'createDate',
      thText: '操作时间',
      nzWidth: '170px'
    },
    {
      thText: '操作',
      type: 'buttons',
      nzWidth: '100px',
      buttons: [
        {
          permission: 'online:logout',
          text: '强制下线',
          click: (row: OnlineUser) => this.onOpenModal(row, this.modalTemplate, this.table)
        }
      ]
    }
  ];

  onlineUser!: OnlineUser;
  time = 0;

  constructor(
    private http: HttpClient,
    private dicService: DicService,
    private modalService: NzxModalService
  ) {}

  onOpenModal(onlineUser: OnlineUser, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.onlineUser = onlineUser;
    this.time = 0;
    this.modalService.create({
      nzTitle: '强制下线',
      nzWidth: 650,
      nzContent,
      nzOnOk: () =>
        firstValueFrom(
          this.http
            .get('/monitor/online/logout', { params: { id: onlineUser.id, time: this.time } })
            .pipe(tap(() => table.refresh(false)))
        )
    });
  }
}

interface OnlineUser {
  id: string;
  username: string;
  failPassword: string;
  type: string;
  browser: string;
  officeName: string;
  os: string;
  address: string;
  ip: string;
  token: string;
  createDate: string;
}
