import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzButtonModule } from '@xmagic/nz-formly/button';
import { FormlyCommonModule } from '@xmagic/nz-formly/common';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzRadioModule } from '@xmagic/nz-formly/radio';
import { FormlyRefTemplateModule } from '@xmagic/nz-formly/ref-template';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { FormlyNzTreeSelectModule } from '@xmagic/nz-formly/tree-select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxModalOptions } from '@xmagic/nzx-antd/modal/nzx-modal.service';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { FetcherService } from '@xmagic/nzx-antd/service';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxFormUtils, NzxUtils } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { FormSearchComponent } from '@commons/component/form-search';
import { InputPasswordComponent } from '@commons/component/input-password';
import { CommonService } from '@commons/service/common.service';

@Component({
  selector: 'ma-menu',
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
    FormlyNzSelectModule,
    FormlyNzTreeSelectModule,
    FormlyNzRadioModule,
    FormlyRefTemplateModule,
    FormlyModule,
    NzFormModule,
    NzButtonModule,
    NzSpaceModule,
    NzCardModule,
    NzInputModule,
    NzTreeModule,
    FormsModule,
    FormSearchComponent,
    NzxTableModule,
    NzxDirectiveModule,
    NzDividerModule,
    NzxPipeModule,
    NzIconModule,
    NzDropDownModule,
    NzTagModule,
    NzxHttpInterceptorModule,
    FormlyCommonModule,
    InputPasswordComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export default class MenuComponent implements OnInit {
  searchForm = new FormGroup({});
  searchModel: { searchValue?: string } = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'searchValue',
      props: {
        label: '关键字'
      }
    }
  ];

  modalForm = new FormGroup({});
  modalModel: Partial<Menu> = {};
  modalFields: FormlyFieldConfig[] = [];

  menus$ = this.http.get<Menu[]>('/system/menu/tree');
  columns: NzxColumn[] = [
    {
      name: 'name',
      thText: '菜单名称',
      showExpand: true
    },
    {
      name: 'url',
      thText: '路径'
    },
    {
      name: 'permission',
      thText: '权限标识',
      nzWidth: '150px'
    },
    {
      name: 'menuType',
      thText: '类型'
    },
    {
      name: 'componentName',
      thText: '组件'
    },
    { name: 'id', thText: '操作', tdTemplate: 'buttons', nzWidth: '175px' }
  ];

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private fetcherService: FetcherService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {}

  onUpdateOpenModal(model: Partial<Menu>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改用户',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/user/center/update', this.modalModel))
    });
  }

  onDeleteClick(row: Menu, table: NzxTableComponent): void {
    return this.handleDelete(row.id, table);
  }

  onBatchDelete(table: NzxTableComponent<Record<string, any>>): void {}

  private handleDelete(id: string | string[], table: NzxTableComponent): void {
    this.commonService.handleDelete({ id, url: '/system/user/delete', table });
  }

  onNewOpenModal(
    model: Partial<Menu>,
    nzContent: TemplateRef<{}>,
    table: NzxTableComponent<Record<string, any>>
  ): void {
    this.openModal(model, {
      nzTitle: '新增',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/user/center/update', this.modalModel))
    });
  }

  private openModal(
    model: Partial<Menu>,
    options: Omit<NzxModalOptions<NzSafeAny, TemplateRef<{}>>, 'nzOnOk'> & {
      nzOnOk: (instance: NzSafeAny) => Promise<false | void | {}>;
      table: NzxTableComponent;
    }
  ): void {
    this.modalForm = new FormGroup({});
    this.modalModel = NzxUtils.clone(model);
    this.modalFields = [
      {
        type: 'row',
        fieldGroup: [
          {
            type: 'input',
            key: 'username',
            props: {
              label: '账号',
              minLength: 3,
              maxLength: 64,
              required: true
            },
            validators: {
              // validation: uniqueValidator
            },
            modelOptions: {
              updateOn: 'blur'
            }
          },
          {
            type: 'ref-template',
            key: 'password',
            props: {
              label: '密码',
              type: 'password',
              refName: 'pwd',
              maxLength: 64
            },
            wrappers: ['field-wrapper']
          },
          {
            type: 'input',
            key: 'name',
            props: {
              label: '姓名',
              maxLength: 64
            }
          },
          {
            type: 'input',
            key: 'phone',
            props: {
              label: '手机号',
              maxLength: 11
            },
            validators: {
              validation: ['mobile']
            }
          }
        ]
      },
      {
        type: 'tree-select',
        key: 'officeId',
        props: {
          label: '组织机构',
          // options: this.nodes$,
          required: true
        }
      },
      {
        type: 'select',
        key: 'roles',
        props: {
          label: '角色',
          options: '/system/role/all' as any,
          nzMode: 'multiple',
          nzShowArrow: true,
          nzAllowClear: true
        }
      }
    ];

    this.modalService.create({
      nzWidth: 650,
      ...options,
      nzOnOk: instance => {
        if (!NzxFormUtils.validate(this.modalForm)) {
          return false;
        }
        return options.nzOnOk(instance).then(v => {
          if (v !== false) {
            options.table.refresh(false);
          }
          return v;
        });
      }
    });
  }
}

interface Menu {
  componentName?: string;
  desc?: string;
  icon?: string;
  id: string;
  isShow: 0 | 1;
  keepAlive: 0 | 1;
  name: string;
  permission?: string;
  pid?: string;
  sort: number;
  url?: string;
  menuType: 'M' | 'D' | 'B' | 'O';
  children: Menu[];
}
