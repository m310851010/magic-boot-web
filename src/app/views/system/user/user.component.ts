import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn } from '@angular/forms';
import { first, map, shareReplay } from 'rxjs';

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
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { FetcherService, LOADING_ENABLED, NzxServiceModule, SYNCED_ENABLED } from '@xmagic/nzx-antd/service';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxFormUtils, NzxUtils, TreeNode } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core/tree';
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
import { CommonService, normalTree } from '@commons/service/common.service';

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
  templateUrl: './user.component.html',
  styleUrl: './user.component.less'
})
export default class UserComponent {
  gridOptions = { nzGutter: 15, colNzSpan: 8 };

  modalForm = new FormGroup({});
  modalModel: Partial<UserInfo> = {};
  modalFields: FormlyFieldConfig[] = [];

  searchForm = new FormGroup({});
  searchModel: Partial<UserInfo> = {};
  searchFields: FormlyFieldConfig[] = [
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
      ]
    }
  ];

  getParams: () => Partial<UserInfo> = () => this.searchModel;
  columns: NzxColumn<UserInfo>[] = [
    { nzShowCheckAll: true, nzShowCheckbox: true },
    { name: 'username', thText: '账号' },
    { name: 'name', thText: '姓名' },
    { name: 'officeName', thText: '所属部门' },
    { name: 'roleNames', thText: '角色', tdTemplate: 'role' },
    { name: 'phone', thText: '手机号' },
    { name: 'isLogin', thText: '状态', tdTemplate: 'status' },
    {
      name: 'id',
      thText: '操作',
      tdTemplate: 'buttons',
      nzWidth: '175px'
    }
  ];

  searchText = '';
  nodes: NzTreeNodeOptions[] = [];
  nodes$ = this.http.get<{ list: NzTreeNodeOptions[] }>('/system/office/tree').pipe(
    shareReplay(1),
    map(v => v.list),
    map(list => {
      const newList = NzxUtils.clone(list);
      normalTree(newList, 'id', node => {
        node['expanded'] = true;
      });
      return newList;
    })
  );

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private fetcherService: FetcherService,
    private messageService: NzMessageService
  ) {
    this.onSearchTextChange('');
  }

  onCollapsedChange(): void {
    this.searchFields = [...this.searchFields];
  }

  onSearchTextChange(text: string): void {
    this.nodes$.pipe(first()).subscribe(nodes => {
      this.nodes = NzxUtils.filterTree(nodes, node => {
        if (node.children && node.children.length) {
          return true;
        }
        return node.title.toLowerCase().includes(text.toLowerCase());
      });
    });
  }

  onEditClick(row: UserInfo, nzContent: TemplateRef<{}>): void {}

  onDeleteClick(row: UserInfo, table: NzxTableComponent): void {
    this.commonService.handleDelete({ id: row.id, url: '/system/user/delete', table });
  }

  /**
   * 重置密码
   * @param row
   */
  onResetPasswordClick(row: UserInfo): void {
    this.modalService.confirm({
      nzContent: `确定重置用户【${row.name || ''}】的密码`,
      nzOnOk: () => {
        this.http
          .get<string>('/system/user/reset-password', { params: { id: row.id } })
          .subscribe(defaultPassword => this.messageService.success(`密码重置成功，默认密码是：${defaultPassword}`));
      }
    });
  }
  onToggleStatus(row: UserInfo): void {}
  /**
   * 展开/折叠树节点
   * @param expanded 是否展开
   */
  onToggleExpandAll(expanded: boolean): void {
    NzxUtils.forEachTree(this.nodes, node => (node.expanded = expanded));
    this.nodes = [...this.nodes];
  }

  onSelectedChange(evt: NzFormatEmitEvent, table: NzxTableComponent): void {
    this.searchModel.officeCode = evt.node!.origin['code'];
    table.refresh(true);
  }

  openModal(nzTitle: string, model: Partial<UserInfo>, nzContent: TemplateRef<{}>): void {
    const uniqueValidator = model.id
      ? []
      : [
          this.fetcherService.remoteValidate({
            url: '/system/user/unique',
            message: '该账号已存在 ',
            data: (control: AbstractControl) => ({ username: control.value })
          })
        ];

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
              disabled: !!model.id,
              minLength: 3,
              maxLength: 64,
              required: true
            },
            validators: {
              validation: uniqueValidator
            },
            modelOptions: {
              updateOn: 'blur'
            }
          },
          model.id
            ? {}
            : {
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
            },
            validators: {
              // validation: ['eitherSpace']
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
          },
          {
            type: 'radio',
            key: 'isLogin',
            defaultValue: 0,
            props: {
              label: '状态',
              options: [
                { label: '正常', value: 0 },
                { label: '停用', value: 1 }
              ]
            }
          }
        ]
      },
      {
        type: 'tree-select',
        key: 'officeId',
        props: {
          label: '组织机构',
          options: this.nodes$,
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
          nzAllowClear: true,
          required: true
        }
      }
    ];

    this.modalService.create({
      nzTitle,
      nzContent,
      nzWidth: 650
    });
  }
}

/**
 * 用户信息
 */
interface UserInfo {
  createDate: string;
  headPortrait?: string;
  id: string;
  isLogin: 0 | 1;
  name?: string;
  roleNames: string[];
  /**
   * 角色ID列表
   */
  roles: string[];
  officeName: string;
  officeId: string;
  phone?: string;
  username: string;
  /**
   * 查询条件
   */
  officeCode?: string;
}
