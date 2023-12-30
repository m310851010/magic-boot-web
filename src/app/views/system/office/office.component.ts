import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
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
import { FormlyNzTreeSelectModule } from '@xmagic/nz-formly/tree-select';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalOptions, NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { DicItem, DicService } from '@xmagic/nzx-antd/service';
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
import { NzTreeModule } from 'ng-zorro-antd/tree';

import { FormSearchComponent } from '@commons/component/form-search';
import { IconPickerComponent } from '@commons/component/icon-picker';
import { CommonService, DeleteButton } from '@commons/service/common.service';
import { dicMap } from '@commons/utils';
import { getMaxSort } from '../menu/menu-utils';
import { Constant } from '@commons/constant';

@Component({
  selector: 'ma-office',
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
    IconPickerComponent
  ],
  templateUrl: './office.component.html',
  styleUrl: './office.component.less'
})
export default class OfficeComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<{}>;
  @ViewChild('table') table!: NzxTableComponent;
  searchForm = new FormGroup({});
  searchModel: { searchValue?: string } = {};
  searchFields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'searchValue',
      props: {
        label: '部门名称',
        attributes: { style: 'width: 300px' }
      }
    }
  ];

  modalForm = new FormGroup({});
  modalModel: Partial<Office> = {};
  modalFields: FormlyFieldConfig[] = [];

  private officeType$ = this.dicService.getDic('OFFICE_TYPE');
  private menus: Office[] = [];
  menusSnapshot: Office[] = [];
  private menus$ = this.http.get<Office[]>('/system/office/tree');
  columns: NzxColumn<Office>[] = [
    { nzShowCheckAll: true, nzShowCheckbox: true },
    { name: 'name', thText: '部门名称', showExpand: true },
    {
      name: 'type',
      thText: '分类',
      nzWidth: '100px',
      format: type => this.officeType$.pipe(map(list => this.dicService.listToMap(list)[type]))
    },
    { name: 'status', thText: '状态', tdTemplate: 'status', nzWidth: '70px' },
    { name: 'leader', thText: '主管' },
    { name: 'sort', thText: '排序号', nzWidth: '70px' },
    { name: 'createDate', thText: '创建时间', nzWidth: '170px' },
    {
      name: 'id',
      thText: '操作',
      buttons: [
        {
          text: '新增下级',
          permission: 'office:save',
          click: (row: Office) =>
            this.onNewOpenModal({ pid: row.id, sort: getMaxSort(row.children) }, this.modalTemplate, this.table)
        },
        {
          text: '修改',
          permission: 'office:save',
          click: (row: Office) => this.onUpdateOpenModal(row, this.modalTemplate, this.table)
        },
        {
          ...DeleteButton,
          permission: 'office:delete',
          click: (row: Office) => {
            this.onDeleteClick(row, this.table);
          }
        }
      ],
      nzWidth: '180px'
    }
  ];

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private messageService: NzMessageService,
    private dicService: DicService
  ) {}

  ngOnInit(): void {
    this.loadMenus();
  }

  onSearchClick(): void {
    if (!this.menus.length) {
      return;
    }

    if (!this.searchModel.searchValue) {
      this.menusSnapshot = this.menus;
      return;
    }

    const keyword = this.searchModel.searchValue.toLowerCase();
    this.menusSnapshot = NzxUtils.filterTree(this.menus, node => {
      if (node.children && node.children.length) {
        node.expand = true;
        return true;
      }
      for (const key of ['name', 'url', 'permission', 'componentName'] as (keyof Office)[]) {
        if (node[key] && (node[key]! as string).toLowerCase().includes(keyword)) {
          return true;
        }
      }
      return false;
    });
  }

  onUpdateOpenModal(model: Partial<Office>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改部门',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/menu/save', this.modalModel))
    });
  }

  onDeleteClick(row: Office, table: NzxTableComponent): void {
    return this.handleDelete(row.id);
  }

  onBatchDelete(table: NzxTableComponent): void {
    const ids = NzxUtils.flatTree(table.nzData)
      .filter(node => node.checked)
      .map(node => node.id);
    if (!ids.length) {
      this.messageService.error('请选择至少一条菜单');
      return;
    }
    return this.handleDelete(ids);
  }

  private handleDelete(id: string | string[]): void {
    this.commonService.handleDelete({ id, url: '/system/menu/delete' }).then(row => {
      if (row) {
        this.loadMenus();
      }
    });
  }

  onNewOpenModal(model: Partial<Office>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    const sort = model.sort || getMaxSort(this.menus);
    this.openModal(
      { ...model, sort },
      {
        nzTitle: '新增部门',
        nzContent,
        table,
        nzOnOk: () => firstValueFrom(this.http.post('/system/menu/save', this.modalModel))
      }
    );
  }

  private loadMenus(): void {
    this.menus$.subscribe(menus => {
      this.menus = menus;
      this.menusSnapshot = menus;
    });
  }

  private openModal(
    model: Partial<Office>,
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
            key: 'name',
            props: {
              label: '部门名称',
              maxLength: 64,
              required: true
            }
          },
          {
            type: 'tree-select',
            key: 'pid',
            props: {
              label: '上级部门',
              nzDefaultExpandAll: true,
              nzAllowClear: true,
              nzShowSearch: true,
              nzHideUnMatched: true,
              nzShowIcon: true,
              options: this.menus$.pipe(
                map(list => {
                  const nodes = [...list];
                  NzxUtils.forEachTree(nodes, node => {
                    if (node.children) {
                      node.children = [...node.children];
                    }

                    if (node.id === model.id) {
                      node.disabled = true;
                      node.isLeaf = true;
                      node.children = [];
                      return false;
                    }
                    return true;
                  });

                  return nodes;
                })
              )
            }
          },
          {
            type: 'select',
            key: 'type',
            props: {
              label: '分类',
              nzAllowClear: true,
              required: true,
              options: this.officeType$
            }
          },
          {
            type: 'radio',
            key: 'status',
            defaultValue: 0,
            props: {
              label: '状态',
              options: Constant.STATUS_OPTIONS
            }
          },
          {
            type: 'input',
            key: 'leader',
            props: {
              label: '负责人',
              maxLength: 256
            }
          },
          {
            type: 'input',
            key: 'phone',
            props: {
              label: '联系电话'
            },
            validators: {
              validation: ['phone']
            }
          },
          {
            type: 'input',
            key: 'permission',
            props: {
              label: '权限码'
            },
            expressions: {
              hide: `model.menuType==='D'`
            }
          },

          {
            type: 'number',
            key: 'sort',
            props: {
              label: '排序号',
              nzMax: 9999,
              nzMin: 0,
              nzPrecision: 0,
              nzStep: 0
            }
          },
          {
            type: 'radio',
            key: 'frame',
            defaultValue: 1,
            props: {
              label: '外链',
              required: true,
              options: [
                { value: 0, label: '是' },
                { value: 1, label: '否' }
              ]
            },
            expressions: {
              hide: `model.menuType!=='M'`
            }
          },
          {
            type: 'radio',
            key: 'isShow',
            defaultValue: 1,
            props: {
              label: '显示状态',
              required: true,
              options: [
                { value: 1, label: '显示' },
                { value: 0, label: '隐藏' }
              ]
            },
            expressions: {
              hide: f => f.model.menuType === 'B'
            }
          },
          {
            type: 'radio',
            key: 'openMode',
            defaultValue: 0,
            props: {
              label: '打开方式',
              required: true,
              options: [
                { value: 0, label: 'iframe' },
                { value: 1, label: '新标签页' }
              ]
            },
            expressions: {
              hide: `model.frame !== 0`
            }
          }
        ]
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

    this.modalService.create({
      nzWidth: 700,
      ...options,
      nzOnOk: instance => {
        if (!NzxFormUtils.validate(this.modalForm)) {
          return false;
        }
        return options.nzOnOk(instance).then(v => {
          if (v) {
            this.loadMenus();
          }
          return v;
        });
      }
    });
  }
}

interface Office {
  id: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 类型 1部门 2公司
   */
  type: string;
  /**
   * 组织机构编码
   */
  code: string;
  pid: string;
  /**
   * 部门状态（0正常 1停用）
   */
  status: number;
  /**
   * 负责人
   */
  leader: string;
  /**
   * 联系电话
   */
  phone: string;
  /**
   * 邮箱
   */
  email: string;
  /**
   * 排序
   */
  sort: number;
  /**
   * 扩展信息
   */
  extJson: string;
  /**
   * 删除标识
   */
  isDel: number;
  createDate: string;

  children: Office[];

  // 树结构需要的属性
  expand: boolean;
  isLeaf: boolean;
  disabled: boolean;
}
