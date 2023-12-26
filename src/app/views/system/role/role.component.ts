import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSearchComponent } from '@commons/component/form-search';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { FormlyNzTreeSelectModule } from '@xmagic/nz-formly/tree-select';
import { FormlyNzRadioModule } from '@xmagic/nz-formly/radio';
import { FormlyRefTemplateModule } from '@xmagic/nz-formly/ref-template';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { FormlyCommonModule } from '@xmagic/nz-formly/common';
import { CommonService, DeleteButton, normalTree } from '@commons/service/common.service';
import { DicService } from '@xmagic/nzx-antd/service';
import { HttpClient } from '@angular/common/http';
import { NzxModalOptions, NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { NzxFormUtils, NzxUtils } from '@xmagic/nzx-antd/util';
import { firstValueFrom, map } from 'rxjs';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { FormlyNzTextareaModule } from '@xmagic/nz-formly/textarea';
import { FormlyNzTreeModule } from '@xmagic/nz-formly/tree';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'ma-role',
  standalone: true,
  imports: [
    CommonModule,
    NzxLayoutPageModule,
    ReactiveFormsModule,
    NzFormlyModule,
    FormlyNzInputModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzSelectModule,
    FormlyNzTreeSelectModule,
    FormlyNzRadioModule,
    FormlyRefTemplateModule,
    FormlyNzTextareaModule,
    FormlyNzTreeModule,
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
    NzCheckboxModule,
    NzSelectModule
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.less'
})
export default class RoleComponent {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<{}>;
  @ViewChild('permissionModalTemplate') permissionModalTemplate!: TemplateRef<{}>;
  @ViewChild('table') table!: NzxTableComponent;
  searchForm = new FormGroup({});
  searchModel: { name?: string } = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      props: {
        label: '角色名称',
        attributes: { style: 'width: 300px' }
      }
    }
  ];

  modalForm = new FormGroup({});
  modalModel: Partial<Role> = {};
  modalFields: FormlyFieldConfig[] = [];

  permission?: number;
  permission$ = this.dicService.getDic('PERMISSION');
  getParams: () => Partial<Role> = () => this.searchModel;
  columns: NzxColumn<Role>[] = [
    { isIndex: true },
    { name: 'name', thText: '角色名称' },
    {
      name: 'permission',
      thText: '权限范围',
      format: value =>
        this.permission$.pipe(
          map(v => this.dicService.listToMap(v)),
          map(dic => dic[value])
        )
    },
    { name: 'createDate', thText: '创建时间' },
    { name: 'desc', thText: '角色描述' },
    {
      name: 'id',
      thText: '操作',
      buttons: [
        {
          text: '修改',
          permission: 'role:save',
          click: (row: Role) => this.onUpdateOpenModal(row, this.modalTemplate, this.table)
        },
        {
          text: '权限',
          permission: 'role:permission',
          click: (row: Role) => this.openPermissionModal(row, this.permissionModalTemplate)
        },
        {
          text: '用户列表',
          permission: 'role:user:list',
          click: (row: Role) => this.onUpdateOpenModal(row, this.modalTemplate, this.table)
        },
        {
          ...DeleteButton,
          permission: 'role:delete',
          click: (row: Role) => {
            this.onDeleteClick(row, this.table);
          }
        }
      ],
      nzWidth: '240px'
    }
  ];

  menuExpand = true;
  menuCheckAll = false;
  menuIndeterminate = false;
  menuCheckStrictly = true;
  menuCheckedKeys: string[] = [];

  officeExpand = true;
  officeCheckAll = false;
  officeIndeterminate = false;
  officeCheckStrictly = true;
  officeCheckedKeys: string[] = [];

  treeMap = (tree: any) => {
    normalTree(tree, '', node => {
      node['expanded'] = true;
    });
    return tree;
  };

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private messageService: NzMessageService,
    private dicService: DicService
  ) {}

  ngOnInit(): void {}

  onUpdateOpenModal(model: Partial<Role>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openRoleModal(model, {
      nzTitle: '修改角色',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/role/save', this.modalModel))
    });
  }

  onDeleteClick(row: Role, table: NzxTableComponent): void {
    this.commonService.handleDelete({ id: row.id, url: '/system/role/delete', table: this.table });
  }

  onNewOpenModal(model: Partial<Role>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openRoleModal(model, {
      nzTitle: '新增角色',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/role/save', this.modalModel))
    });
  }

  private openPermissionModal(model: Partial<Role>, nzContent: TemplateRef<{}>) {
    this.modalFields = [
      {
        type: 'tree',
        key: 'menus',
        props: {
          nzData: '/system/menu/tree',
          nzCheckable: true,
          labelName: 'menuLabelTemplate'
        }
      },

      {
        type: 'select',
        key: 'permission',
        props: {
          label: '权限范围',
          nzShowArrow: true,
          nzAllowClear: true,
          options: this.permission$
        }
      },

      {
        type: 'tree',
        key: 'offices',
        props: {
          label: '权限范围',
          nzCheckable: true,
          nzData: '/system/office/tree'
        }
      }
    ];
    this.openModal(model, {
      nzTitle: '分配权限',
      nzContent,
      nzWidth: '850px',
      nzBodyStyle: { 'padding-top': '0', 'padding-bottom': '0' },
      nzOnOk: () => firstValueFrom(this.http.post('/system/role/permission', this.modalModel))
    });
  }

  menuCheckAllChange(checkAll: boolean): void {}
  officeCheckAllChange(checkAll: boolean): void {}

  private openRoleModal(
    model: Partial<Role>,
    options: Omit<NzxModalOptions<NzSafeAny, TemplateRef<{}>>, 'nzOnOk'> & {
      nzOnOk: (instance: NzSafeAny) => Promise<false | void | {}>;
      table: NzxTableComponent;
    }
  ): void {
    this.modalFields = [
      {
        type: 'input',
        key: 'name',
        props: {
          label: '角色名称',
          maxLength: 64,
          required: true
        }
      },
      {
        type: 'textarea',
        key: 'desc',
        props: {
          label: '备注',
          rows: 4,
          maxLength: 200,
          nzMaxCharacterCount: 200
        }
      }
    ];
    this.openModal(model, options);
  }

  private openModal(
    model: Partial<Role>,
    options: Omit<NzxModalOptions<NzSafeAny, TemplateRef<{}>>, 'nzOnOk'> & {
      nzOnOk: (instance: NzSafeAny) => Promise<false | void | {}>;
      table?: NzxTableComponent;
    }
  ): void {
    this.modalForm = new FormGroup({});
    this.modalModel = NzxUtils.clone(model);
    this.modalService.create({
      nzWidth: 650,
      ...options,
      nzOnOk: instance => {
        if (!NzxFormUtils.validate(this.modalForm)) {
          return false;
        }
        return options.nzOnOk(instance).then(v => {
          if (v && options.table) {
            options.table.refresh(false);
          }
          return v;
        });
      }
    });
  }
}

interface Role {
  id: string;
  /**
   * 角色名称
   */
  name: string /**
  /**
   * 排序
   */;
  sort?: number;
  /**
   * 描述
   */
  desc?: string;
  /**
   * 权限范围 0：全部数据，1：自定义数据，2：本部门及以下数据，3：本部门数据, 4仅个人数据
   */
  permission?: 0 | 1 | 2 | 3 | 4;
}
