import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, map, of } from 'rxjs';
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
import { Constant } from '@commons/constant';
import { CommonService, DeleteButton } from '@commons/service/common.service';

import { getMaxSort } from '../menu/menu-utils';

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
        label: '关键字',
        placeholder: '部门名称、主管',
        attributes: { style: 'width: 300px' }
      }
    }
  ];

  modalForm = new FormGroup({});
  modalModel: Partial<Office> = {};
  modalFields: FormlyFieldConfig[] = [];

  private officeType$ = this.dicService.getDic('OFFICE_TYPE');
  private offices: Office[] = [];
  officesSnapshot: Office[] = [];
  private offices$ = this.http.get<Office[]>('/system/office/tree');
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
          permission: 'office:update',
          click: (row: Office) => this.onUpdateOpenModal({ ...row, children: [] }, this.modalTemplate, this.table)
        },
        {
          ...DeleteButton,
          permission: 'office:delete',
          click: (row: Office) => this.onDeleteClick(row)
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
    this.loadData();
  }

  onSearchClick(): void {
    if (!this.offices.length) {
      return;
    }

    if (!this.searchModel.searchValue) {
      this.officesSnapshot = this.offices;
      return;
    }

    const keyword = this.searchModel.searchValue.toLowerCase();
    this.officesSnapshot = NzxUtils.filterTree(this.offices, node => {
      if (node.children && node.children.length) {
        node.expand = true;
        return true;
      }
      for (const key of ['name', 'leader'] as (keyof Office)[]) {
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
      nzOnOk: () => firstValueFrom(this.http.post('/system/office/update', this.modalModel))
    });
  }

  onDeleteClick(row: Office): void {
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
    this.commonService.handleDelete({ id, url: '/system/office/delete' }).then(row => {
      if (row) {
        this.loadData();
      }
    });
  }

  onNewOpenModal(model: Partial<Office>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    const sort = model.sort || getMaxSort(this.offices);
    this.openModal(
      { ...model, sort },
      {
        nzTitle: '新增部门',
        nzContent,
        table,
        nzOnOk: () => firstValueFrom(this.http.post('/system/office/save', this.modalModel))
      }
    );
  }

  onRefreshClick(): void {
    this.loadData();
  }

  private loadData(): void {
    this.offices$.subscribe(menus => {
      this.offices = menus;
      this.officesSnapshot = menus;
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
    const nodes = NzxUtils.clone(this.offices);
    NzxUtils.forEachTree(nodes, node => {
      if (!node.children || !node.children.length) {
        node.isLeaf = true;
      }

      if (node.id === model.id) {
        node.isLeaf = true;
        node.disabled = true;
        node.children = [];
      }
      return true;
    });

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
              options: nodes
            }
          },
          {
            type: 'select',
            key: 'type',
            defaultValue: 2,
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
              required: true,
              options: Constant.STATUS_OPTIONS
            }
          },
          {
            type: 'input',
            key: 'leader',
            props: {
              label: '负责人',
              maxLength: 64
            }
          },
          {
            type: 'input',
            key: 'phone',
            props: {
              label: '联系电话'
            },
            validators: {
              validation: ['mobile']
            }
          },
          {
            type: 'input',
            key: 'email',
            props: {
              label: '邮箱',
              maxLength: 128
            },
            validators: {
              validation: ['email']
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
              nzStep: 0,
              required: true
            }
          }
        ]
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
            this.loadData();
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
