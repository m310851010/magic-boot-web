import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, NgZone } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first, map, share, shareReplay, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
import { FormlyNzButtonModule } from '@xmagic/nz-formly/button';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { AsyncOption } from '@xmagic/nzx-antd/pipe/to-async.pipe';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxUtils, TreeNode } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
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
    NzDropDownModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.less'
})
export default class UserComponent {
  gridOptions = { nzGutter: 15, colNzSpan: 8 };
  searchForm = new FormGroup({});
  searchModal: Record<string, any> = {};
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
          key: 'roleId',
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

  getParams: () => Record<string, any> = () => this.searchModal;
  columns: NzxColumn[] = [
    { nzShowCheckAll: true, nzShowCheckbox: true },
    { isIndex: true },
    { name: 'username', thText: '登录名称' },
    { name: 'name', thText: '姓名' },
    { name: 'sex', thText: '性别' },
    { name: 'officeName', thText: '所属部门' },
    { name: 'roles', thText: '角色' },
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
    tap(list =>
      normalTree(list, node => {
        node['expanded'] = true;
      })
    )
  );

  constructor(
    private http: HttpClient,
    private commonService: CommonService
  ) {
    this.onSearchTextChange('');
  }

  onCollapsedChange(): void {
    this.searchFields = [...this.searchFields];
    console.log('====');
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

  onEditClick(row: Record<string, any>): void {
    console.log(row);
  }

  onDeleteClick(row: Record<string, any>, table: NzxTableComponent): void {
    this.commonService.handleDelete({ id: row['id'], url: '/system/user/delete', table });
  }

  onResetClick(row: Record<string, any>): void {}

  onExpandAll(): void {}

  onUnExpandAll(): void {}
}
