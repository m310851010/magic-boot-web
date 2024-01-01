import { CdkFixedSizeVirtualScroll, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, first, firstValueFrom, map, of, shareReplay } from 'rxjs';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzFormlyModule } from '@xmagic/nz-formly';
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
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormatEmitEvent } from 'ng-zorro-antd/core/tree';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTreeComponent, NzTreeModule, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { sm3 } from 'sm-crypto-v2';

import { FormSearchComponent } from '@commons/component/form-search';
import { InputPasswordComponent } from '@commons/component/input-password';
import { Constant } from '@commons/constant';
import { CommonService } from '@commons/service/common.service';
import { normalTree } from '@commons/utils';

@Component({
  selector: 'ma-dic',
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
    NzTagModule,
    NzxHttpInterceptorModule,
    FormlyCommonModule,
    InputPasswordComponent,
    NzListModule,
    NzSkeletonModule,
    NzAvatarModule
  ],
  templateUrl: './dic.component.html',
  styleUrl: './dic.component.less'
})
export default class DicComponent {
  selected?: Dict;
  gridOptions = { nzGutter: 15, colNzSpan: 8, labelNzFlex: '60px' };
  collapsed = true;

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
            options: '/system/user/role/list' as any,
            nzMode: 'multiple',
            nzShowArrow: true,
            nzAllowClear: true
          }
        },
        {
          type: 'input',
          key: 'phone',
          props: {
            label: '手机号'
          },
          expressions: {
            hide: () => this.collapsed
          }
        },
        {
          type: 'select',
          key: 'isLogin',
          props: {
            label: '状态',
            options: Constant.STATUS_OPTIONS,
            nzAllowClear: true
          },
          expressions: {
            hide: () => this.collapsed
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
    { name: 'isLogin', thText: '状态', tdTemplate: 'status', nzWidth: '70px' },
    { name: 'createDate', thText: '创建时间', nzWidth: '170px' },
    { name: 'id', thText: '操作', tdTemplate: 'buttons', nzWidth: '180px' }
  ];

  searchText = '';
  dic$ = this.http.post<Dict[]>('/system/dict/list', {});

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private fetcherService: FetcherService,
    private messageService: NzMessageService
  ) {}

  onCollapsedChange(): void {
    this.searchFields = [...this.searchFields];
  }

  onDeleteClick(row: UserInfo, table: NzxTableComponent): void {
    this.handleDelete(row.id, table);
  }

  onBatchDelete(table: NzxTableComponent): void {
    const id = table.nzData.filter(v => v.checked).map(v => v.id);
    if (!id.length) {
      this.messageService.error('请选择至少一条用户信息 ');
      return;
    }
    this.handleDelete(id, table);
  }

  private handleDelete(id: string | string[], table: NzxTableComponent): void {
    this.commonService.handleDelete({ id, url: '/system/user/delete', table });
  }

  /**
   * 重置密码
   * @param row
   */
  onResetPasswordClick(row: UserInfo): void {
    this.modalService.confirm({
      nzContent: `确定重置用户【${row.name || row.username}】的密码`,
      nzOnOk: () => {
        this.http
          .get<string>('/system/user/reset-password', { params: { id: row.id } })
          .subscribe(defaultPassword => this.messageService.success(`密码重置成功，默认密码是：${defaultPassword}`));
      }
    });
  }

  /**
   * 切换用户状态
   * @param row
   */
  onToggleStatus(row: UserInfo): void {
    const isLogin = row.isLogin === 0 ? 1 : 0;
    this.http.get<number>('/system/user/change/status', { params: { isLogin, id: row.id } }).subscribe(count => {
      if (count) {
        this.messageService.success('修改成功!');
      } else {
        this.messageService.error('修改失败,用户不存在或已被删除!');
      }
      row.isLogin = isLogin;
    });
  }

  onSelectedChange(evt: NzFormatEmitEvent, nzTreeComponent: NzTreeComponent, table: NzxTableComponent): void {
    this.searchModel.officeCode = evt.node!.isSelected ? evt.node!.origin['code'] : null;
    table.refresh(true);
  }

  onNewOpenModal(nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(
      {},
      {
        nzTitle: '新增用户',
        nzContent,
        table,
        nzOnOk: () => {
          return firstValueFrom(
            this.http.post('/system/user/save', {
              ...this.modalModel,
              password: this.modalModel.password ? sm3(this.modalModel.password) : null
            })
          );
        }
      }
    );
  }

  onUpdateOpenModal(model: Partial<UserInfo>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改用户',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/user/update', this.modalModel))
    });
  }

  private openModal(
    model: Partial<UserInfo>,
    options: Omit<NzxModalOptions<NzSafeAny, TemplateRef<{}>>, 'nzOnOk'> & {
      nzOnOk: (instance: NzSafeAny) => Promise<false | void | {}>;
      table: NzxTableComponent;
    }
  ): void {
    const uniqueValidator = model.id
      ? []
      : [
          (control: AbstractControl) => {
            const value = control.value;
            if (value == null || !/^\w{3,64}$/.test(value)) {
              return null;
            }
            return this.fetcherService.remoteValidate({
              url: '/system/user/unique',
              message: '该账号已存在',
              data: (control: AbstractControl) => ({ username: control.value })
            })(control);
          }
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
              label: '姓名 ',
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
          },
          model.id === '1'
            ? {}
            : {
                type: 'radio',
                key: 'isLogin',
                defaultValue: 0,
                props: {
                  label: '状态',
                  options: Constant.STATUS_OPTIONS,
                  required: true
                }
              }
        ]
      },
      {
        type: 'tree-select',
        key: 'officeId',
        props: {
          label: '所属部门',
          options: this.dic$,
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
          if (v && options.table) {
            options.table.refresh(false);
          }
          return v;
        });
      }
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
  password?: string;
  /**
   * 查询条件
   */
  officeCode?: string;
}

interface Dict {
  id: string;
  /**
   * 父节点
   */
  pid: string;
  /**
   * 名称
   */
  label: string;
  /**
   * 字典值
   */
  value: string;
  /**
   * 字典类型：0系统类，1业务类
   */
  dictType: 0 | 1;
  /**
   * 排序号
   */
  sort: number;
  /**
   * 数据类型,0:string 1: number
   */
  dataType: 0 | 1;
  /**
   * 删除标识：0未删除，1已删除
   */
  isDel: 0 | 1;
  /**
   * 状态 0: 正常 1: 停用
   */
  status: 0 | 1;
  /**
   * 扩展JSON数据
   */
  extJson?: string;
  /**
   * 描述
   */
  desc?: string;
}
