import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone, TemplateRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first, map, share, shareReplay, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzButtonModule } from '@xmagic/nz-formly/button';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzRadioModule } from '@xmagic/nz-formly/radio';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { FormlyNzTreeSelectModule } from '@xmagic/nz-formly/tree-select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxUtils, TreeNode } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core/tree';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTreeComponent, NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

import { FormSearchComponent } from '@commons/component/form-search';
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
    NzTagModule
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
            label: '用户名'
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
    { isIndex: true },
    { name: 'username', thText: '登录名称' },
    { name: 'name', thText: '姓名' },
    { name: 'sex', thText: '性别' },
    { name: 'officeName', thText: '所属部门' },
    { name: 'roleNames', thText: '角色', tdTemplate: 'role' },
    { name: 'phone', thText: '手机号' },
    {
      name: 'id',
      thText: '操作',
      tdTemplate: 'buttons',
      nzWidth: '140px'
    }
  ];

  searchText = '';
  nodes: NzTreeNodeOptions[] = [];
  nodes$ = this.http.get<{ list: NzTreeNodeOptions[] }>('/system/office/tree').pipe(
    shareReplay(1),
    map(v => v.list),
    map(list => {
      const newList = NzxUtils.clone(list);
      normalTree(newList, node => {
        node['expanded'] = true;
      });
      return newList;
    })
  );

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService
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

  onEditClick(row: UserInfo, nzContent: TemplateRef<{}>): void {
    // (click)="openModal('新建用户', {}, modalTemplate)"
    // this.openModal();
  }

  onDeleteClick(row: UserInfo, table: NzxTableComponent): void {
    this.commonService.handleDelete({ id: row.id, url: '/system/user/delete', table });
  }

  onResetPasswordClick(row: UserInfo): void {
    console.log('  ');
  }

  /**
   * 展开/折叠树节点
   * @param expanded 是否展开
   */
  onToggleExpandAll(expanded: boolean): void {
    NzxUtils.forEachTree(this.nodes, node => (node.expanded = expanded));
    this.nodes = [...this.nodes];
  }

  onCheckBoxChange(evt: NzFormatEmitEvent, table: NzxTableComponent): void {
    const officeIds: string[] = [];
    NzxUtils.forEachTree(evt.checkedKeys!, n => {
      officeIds.push(n.key);
    });
    this.searchModel.officeId = officeIds;
    table.refresh(true);
  }

  openModal(nzTitle: string, model: Partial<UserInfo>, nzContent: TemplateRef<{}>): void {
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
              label: '用户名',
              disabled: !!model.id
            }
          },
          model.id
            ? {}
            : {
                type: 'input',
                key: 'password',
                props: {
                  label: '密码',
                  required: true,
                  type: 'password',
                  attributes: { autocomplete: 'new-password' }
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
          },
          {
            type: 'radio',
            key: 'isLogin',
            defaultValue: 0,
            props: {
              label: '状态',
              options: [
                { label: '正常', value: 0 },
                { label: '锁定', value: 1 }
              ]
            }
          }
        ]
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
  phone?: string;
  username: string;
  sex?: string;

  /**
   * 查询条件
   */
  officeId: string[];
}
