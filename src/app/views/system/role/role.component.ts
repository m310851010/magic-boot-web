import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, QueryList, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first, firstValueFrom, forkJoin, map, Observable, shareReplay } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyCommonModule } from '@xmagic/nz-formly/common';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzRadioModule } from '@xmagic/nz-formly/radio';
import { FormlyRefTemplateModule } from '@xmagic/nz-formly/ref-template';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { FormlyNzTextareaModule } from '@xmagic/nz-formly/textarea';
import { FormlyNzTreeModule } from '@xmagic/nz-formly/tree';
import { FormlyNzTreeSelectModule } from '@xmagic/nz-formly/tree-select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalOptions, NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { DicService } from '@xmagic/nzx-antd/service';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxFormUtils, NzxUtils, TreeNode } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTreeNodeKey } from 'ng-zorro-antd/core/tree';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTreeComponent, NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { FormSearchComponent } from '@commons/component/form-search';
import { CommonService, DeleteButton, normalTree } from '@commons/service/common.service';
import { UserInfo } from '@commons/service/user-info';
import { listToMap } from '@commons/utils';

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
  @ViewChild('userModalTemplate') userModalTemplate!: TemplateRef<{}>;
  @ViewChild('permissionModalTemplate') permissionModalTemplate!: TemplateRef<{}>;
  @ViewChild('table') table!: NzxTableComponent;
  @ViewChildren('userTable') userTable!: QueryList<NzxTableComponent<UserInfo & { checked: boolean }>>;
  @ViewChild('menuTree') menuTreeComponent!: NzTreeComponent;
  @ViewChild('officeTree') officeTreeComponent!: NzTreeComponent;

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
    { name: 'desc', thText: '角色描述' },
    { name: 'createDate', thText: '创建时间', nzWidth: '170px' },
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
          click: (row: Role) => this.openPermissionModal(row, this.permissionModalTemplate, this.table)
        },
        {
          text: '分配用户',
          permission: 'role:user:list',
          click: (row: Role) => this.openUserModal(row)
        },
        {
          ...DeleteButton,
          permission: 'role:delete',
          click: (row: Role) => this.onDeleteClick(row, this.table)
        }
      ],
      nzWidth: '240px'
    }
  ];

  menuExpand = false;
  menuCheckAll = false;
  menuIndeterminate = false;
  menuCheckStrictly = true;
  menuCheckedKeys: NzTreeNodeKey[] = [];

  officeExpand = false;
  officeCheckAll = false;
  officeIndeterminate = false;
  officeCheckStrictly = true;
  officeCheckedKeys: NzTreeNodeKey[] = [];
  customOfficeLoad = false;

  menu$!: Observable<NzTreeNodeOptions[]>;
  office$!: Observable<NzTreeNodeOptions[]>;

  // 分配用户对话框
  private selectedRole!: Role;

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private dicService: DicService,
    private messageService: NzMessageService
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
    this.commonService.handleDelete({ id: row.id, url: '/system/role/delete', table });
  }

  onNewOpenModal(model: Partial<Role>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openRoleModal(model, {
      nzTitle: '新增角色',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/role/save', this.modalModel))
    });
  }

  onBatchCancel(table: NzxTableComponent): void {
    console.log('v ssn   s  ');
  }

  onUnallocatedUserModal(nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    const model: Record<string, any> = { roleId: this.selectedRole.id };
    const url = '/system/role/unallocated/users';
    this.modalService.create({
      nzTitle: '选择用户',
      nzWidth: 1200,
      nzContent,
      nzData: {
        allocate: false,
        url,
        columns: this.getUserColumns(),
        getParams: () => model,
        model,
        form: new FormGroup({}),
        fields: this.getUserSearchFields()
      },
      nzBodyStyle: {
        'padding-top': '0',
        'padding-bottom': '0'
      },
      nzOnOk: () => {
        const selectionTable = this.userTable.filter(v => v.api === url)[0]!;
        const nzData = selectionTable.nzData || [];
        if (!nzData.length) {
          this.messageService.error('没有可以分配的用户，请点击"查询"重试');
          return false;
        }

        const users = nzData.filter(v => v.checked).map(v => v.id);
        if (!users.length) {
          this.messageService.error('请选择要分配的用户');
          return false;
        }
        return firstValueFrom(
          this.http
            .post('/system/role/allocate/users', { id: this.selectedRole.id, users })
            .pipe(tap(() => table.refresh(true)))
        );
      }
    });
  }

  private openUserModal(row: Role): void {
    this.selectedRole = row;
    const model: Record<string, any> = { roleId: this.selectedRole.id };
    this.modalService.create({
      nzTitle: '分配用户',
      nzWidth: 1200,
      nzContent: this.userModalTemplate,
      nzData: {
        allocate: true,
        url: '/system/role/list/users',
        columns: this.getUserColumns().concat([
          {
            name: 'id',
            thText: '操作',
            nzWidth: '80px',
            tdTemplate: 'buttons'
          }
        ]),
        getParams: () => model,
        model,
        form: new FormGroup({}),
        fields: this.getUserSearchFields()
      },
      nzCancelText: '关闭',
      nzOkText: null,
      nzBodyStyle: {
        'padding-top': '0',
        'padding-bottom': '0'
      }
    });
  }

  onCancelUsers(row: UserInfo, table: NzxTableComponent<UserInfo & { checked: boolean }>): void {
    this.handleCancelUsers(row.id, table, `确认要取消该用户"${row.name || row.username}"角色吗？`);
  }

  onBatchCancelUsers(table: NzxTableComponent): void {
    const id = table.nzData.filter(v => v.checked).map(v => v.id);
    if (!id.length) {
      this.messageService.error('请选择至少一条用户信息');
      return;
    }
    this.handleCancelUsers(id, table, '是否取消选中用户授权数据项？');
  }

  private handleCancelUsers(userId: string | string[], table: NzxTableComponent, message: string): void {
    this.modalService.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.http
          .delete('/system/role/cancel/users', {
            params: {
              id: this.selectedRole.id,
              users: NzxUtils.isArray(userId) ? userId.join(',') : userId
            }
          })
          .subscribe(result => {
            if (result) {
              table.refresh(false);
              this.messageService.success('取消成功');
            } else {
              this.messageService.warning('用户信息不存在或已被删除');
            }
          });
      }
    });
  }

  private getUserColumns(): NzxColumn<UserInfo>[] {
    return [
      { nzShowCheckAll: true, nzShowCheckbox: true },
      { name: 'username', thText: '账号' },
      { name: 'name', thText: '姓名' },
      { name: 'officeName', thText: '所属部门' },
      { name: 'phone', thText: '手机号' },
      { name: 'isLogin', thText: '状态', tdTemplate: 'status', nzWidth: '60px' },
      { name: 'createDate', thText: '创建时间', nzWidth: '170px' }
    ];
  }

  private getUserSearchFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'row',
        fieldGroup: [
          {
            type: 'input',
            key: 'username',
            props: {
              label: '账号'
            }
          },
          {
            type: 'input',
            key: 'name',
            props: {
              label: '姓名'
            }
          },
          {
            type: 'input',
            key: 'phone',
            props: {
              label: '手机号'
            }
          }
        ]
      }
    ];
  }

  private openPermissionModal(model: Role, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.menuExpand = false;
    this.menuCheckAll = false;
    this.menuIndeterminate = false;
    this.menuCheckStrictly = true;

    this.officeExpand = false;
    this.officeCheckAll = false;
    this.officeIndeterminate = false;
    this.officeCheckStrictly = true;
    this.customOfficeLoad = model.permission === 1;

    this.permission = model.permission;

    let menuChecked: Record<string, boolean> = {};
    let officeChecked: Record<string, boolean> = {};

    this.menu$ = this.http.get<TreeNode[]>('/system/menu/tree').pipe(
      map(tree => {
        const checkedKeys: string[] = [];
        let hasChecked = false;
        let hasUnChecked = false;

        const nodes = normalTree(tree, '', node => {
          if (menuChecked[node['key']]) {
            hasChecked = true;
            checkedKeys.push(node['key']);
          } else {
            hasUnChecked = true;
          }
        });

        this.checkboxStatus(hasChecked, hasUnChecked, 'menuCheckAll', 'menuIndeterminate');
        this.menuCheckedKeys = checkedKeys;
        return nodes;
      })
    );
    this.office$ = this.http.get<TreeNode[]>('/system/office/tree').pipe(
      map(tree => {
        const checkedKeys: string[] = [];
        let hasChecked = false;
        let hasUnChecked = false;
        const nodes = normalTree(tree, '', node => {
          if (officeChecked[node['key']]) {
            hasChecked = true;
            checkedKeys.push(node['key']);
          } else {
            hasUnChecked = true;
          }
        });
        this.checkboxStatus(hasChecked, hasUnChecked, 'officeCheckAll', 'officeIndeterminate');
        this.officeCheckedKeys = checkedKeys;
        console.log(nodes);
        return nodes;
      }),
      first(),
      shareReplay(1)
    );

    const params = { params: { roleId: model.id } };
    const reqs: Observable<string[]>[] = [this.http.get<string[]>('/system/role/menu/list', params)];
    if (model.permission === 1) {
      reqs.push(this.http.get<string[]>('/system/role/offices/list', params));
    }
    forkJoin(reqs).subscribe(([menuKeys, officeKeys]) => {
      menuChecked = listToMap(menuKeys, null, () => true);
      officeChecked = listToMap(officeKeys, null, () => true);

      this.openModal(model, {
        nzTitle: '分配权限',
        nzContent,
        nzWidth: '850px',
        table,
        nzBodyStyle: { 'padding-top': '0', 'padding-bottom': '0' },
        nzOnOk: () => {
          const menus = this.getTreeCheckedKeys(this.menuTreeComponent);
          const offices = this.permission === 1 ? this.getTreeCheckedKeys(this.officeTreeComponent) : [];

          return firstValueFrom(
            this.http.post('/system/role/permission', { id: model.id, permission: this.permission, menus, offices })
          );
        }
      });
    });
  }

  onPermissionChange(value: number): void {
    this.permission = value;
    if (value === 1) {
      this.customOfficeLoad = true;
    }
  }

  onToggleExpandAll(expanded: boolean, tree: NzTreeComponent): void {
    NzxUtils.forEachTree(tree.getTreeNodes(), node => {
      if (!node.isLeaf) {
        node.isExpanded = expanded;
      }
    });
  }

  treeCheckAllChange(
    checkAll: boolean,
    tree: NzTreeComponent,
    indeterminateName: 'menuIndeterminate' | 'officeIndeterminate'
  ): void {
    const nodeKeys: string[] = [];
    if (checkAll) {
      NzxUtils.forEachTree(tree.getTreeNodes(), node => {
        nodeKeys.push(node.key);
      });
    }
    tree.handleCheckedKeys(nodeKeys);
    this[indeterminateName] = false;
  }

  treeCheckBoxChange(
    tree: NzTreeComponent,
    checkAllName: 'menuCheckAll' | 'officeCheckAll',
    indeterminateName: 'menuIndeterminate' | 'officeIndeterminate'
  ): void {
    let hasChecked = false;
    let hasUnChecked = false;
    NzxUtils.forEachTree(tree.getTreeNodes(), node => {
      if (node.isChecked) {
        hasChecked = true;
      } else {
        hasUnChecked = true;
      }
    });

    this.checkboxStatus(hasChecked, hasUnChecked, checkAllName, indeterminateName);
  }

  private checkboxStatus(
    hasChecked: boolean,
    hasUnChecked: boolean,
    checkAllName: 'menuCheckAll' | 'officeCheckAll',
    indeterminateName: 'menuIndeterminate' | 'officeIndeterminate'
  ): void {
    if (hasChecked && !hasUnChecked) {
      this[checkAllName] = true;
      this[indeterminateName] = false;
      return;
    }
    if (hasChecked && hasUnChecked) {
      this[checkAllName] = false;
      this[indeterminateName] = true;
      return;
    }
    this[checkAllName] = false;
    this[indeterminateName] = false;
  }

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
  ): NzModalRef {
    this.modalForm = new FormGroup({});
    this.modalModel = NzxUtils.clone(model);
    return this.modalService.create({
      nzWidth: 650,
      ...options,
      nzOnOk: instance => {
        if (!NzxFormUtils.validate(this.modalForm)) {
          return false;
        }
        return options.nzOnOk(instance).then(v => {
          if (v) {
            this.messageService.success('保存成功');
          }
          if (v && options.table) {
            options.table.refresh(false);
          }
          return v;
        });
      }
    });
  }

  private getTreeCheckedKeys(tree: NzTreeComponent): string[] {
    const keys: string[] = [];
    NzxUtils.forEachTree(tree.getTreeNodes(), node => {
      if (node.isChecked) {
        keys.push(node.key);
      }
    });
    return keys;
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
