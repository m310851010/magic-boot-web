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
import { NzxModalService, NzxModalOptions } from '@xmagic/nzx-antd/modal';
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

import { getMaxSort } from './menu-utils';

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
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.less'
})
export default class MenuComponent implements OnInit {
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
        placeholder: '菜单名称、路由地址、权限码、组件',
        attributes: { style: 'width: 300px' }
      }
    }
  ];

  modalForm = new FormGroup({});
  modalModel: Partial<Menu> = {};
  modalFields: FormlyFieldConfig[] = [];

  private menus: Menu[] = [];
  menusSnapshot: Menu[] = [];
  private menus$ = this.http.get<Menu[]>('/system/menu/tree').pipe(map(v => v || []));
  columns: NzxColumn<Menu>[] = [
    { nzShowCheckAll: true, nzShowCheckbox: true },
    { name: 'name', thText: '菜单名称', showExpand: true },
    { name: 'icon', thText: '图标', tdTemplate: 'tdIconTemplate', nzWidth: '50px' },
    { name: 'url', thText: '路由地址' },
    { name: 'permission', thText: '权限标识', nzWidth: '150px' },
    { name: 'menuType', thText: '菜单类型', tdTemplate: 'menuTypeTemplate', nzWidth: '80px' },
    { name: 'componentName', thText: '组件' },
    { name: 'sort', thText: '排序号', nzWidth: '70px' },
    { name: 'isShow', thText: '显示状态', format: isShow => (isShow ? '显示' : '隐藏'), nzWidth: '80px' },
    {
      name: 'id',
      thText: '操作',
      buttons: [
        {
          text: '新增下级',
          permission: 'menu:save',
          visible: (row: Menu) => row.menuType === 'D' || row.menuType === 'M',
          click: (row: Menu) =>
            this.onNewOpenModal(
              { pid: row.id, menuType: row.menuType === 'D' ? 'M' : 'B', sort: getMaxSort(row.children) },
              this.modalTemplate,
              this.table
            )
        },
        {
          text: '修改',
          permission: 'menu:save',
          click: (row: Menu) => this.onUpdateOpenModal(row, this.modalTemplate, this.table)
        },
        {
          ...DeleteButton,
          permission: 'menu:delete',
          click: (row: Menu) => this.onDeleteClick(row)
        }
      ],
      nzWidth: '160px'
    }
  ];

  menuTypeMap: Record<string, DicItem & { color: string }> = {};
  menuTypes: DicItem[] = [];
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private messageService: NzMessageService,
    private dicService: DicService
  ) {}

  ngOnInit(): void {
    this.dicService
      .getDic('MENU_TYPE')
      .pipe(
        tap(list => (this.menuTypes = list)),
        dicMap<DicItem & { color: string }>()
      )
      .subscribe(v => (this.menuTypeMap = v));

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
      for (const key of ['name', 'url', 'permission', 'componentName'] as (keyof Menu)[]) {
        if (node[key] && (node[key]! as string).toLowerCase().includes(keyword)) {
          return true;
        }
      }
      return false;
    });
  }

  onUpdateOpenModal(model: Partial<Menu>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改菜单',
      nzContent,
      table,
      nzOnOk: () => firstValueFrom(this.http.post('/system/menu/save', this.modalModel))
    });
  }

  onDeleteClick(row: Menu): void {
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

  onNewOpenModal(model: Partial<Menu>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    const sort = model.sort || getMaxSort(this.menus);
    this.openModal(
      { ...model, sort },
      {
        nzTitle: '新增菜单',
        nzContent,
        table,
        nzOnOk: () => firstValueFrom(this.http.post('/system/menu/save', this.modalModel))
      }
    );
  }

  onRefreshClick(): void {
    this.loadMenus();
  }

  private loadMenus(): void {
    this.menus$.subscribe(menus => {
      this.menus = menus;
      this.menusSnapshot = menus;
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
        type: 'radio',
        key: 'menuType',
        defaultValue: 'M',
        props: {
          label: '菜单类型',
          options: this.menuTypes
        }
      },
      {
        type: 'row',
        fieldGroup: [
          {
            type: 'input',
            key: 'name',
            props: {
              label: '菜单名称',
              maxLength: 64,
              required: true
            }
          },
          {
            type: 'tree-select',
            key: 'pid',
            props: {
              label: '上级菜单',
              nzDefaultExpandAll: true,
              nzAllowClear: true,
              nzShowSearch: true,
              nzHideUnMatched: true,
              nzShowIcon: true,
              options: this.menus$.pipe(
                map(list => {
                  const nodes = [...list];
                  if (model.menuType === 'D') {
                    const dNode = nodes.find(v => v.id === model.id);
                    if (dNode) {
                      dNode.isLeaf = true;
                      dNode.children = [];
                    }
                  }
                  NzxUtils.forEachTree(nodes, node => {
                    if (node.children) {
                      node.children = [...node.children];
                    }

                    if (node.id === model.id) {
                      node.disabled = true;
                    }
                    if (node.menuType === 'D') {
                      return;
                    }
                    if (node.menuType === 'M') {
                      node.isLeaf = true;
                      node.children = [];
                      return;
                    }
                  });

                  return nodes;
                })
              )
            },
            expressions: {
              'props.required': `model.menuType === 'B'`
            }
          },
          {
            type: 'input',
            key: 'url',
            props: {
              label: '路由地址',
              maxLength: 256,
              required: true
            },
            validators: {
              validation: [
                (control: AbstractControl) => {
                  if (!control.value) {
                    return null;
                  }
                  if (/^(https?:\/\/|\/).+/i.test(control.value)) {
                    return null;
                  }
                  return { menuUrl: { message: '路由地址以"http://" "https://"或"/"开头' } };
                }
              ]
            },
            expressions: {
              hide: `model.menuType==='D' || model.menuType=='B'`
            }
          },
          {
            type: 'input',
            key: 'componentName',
            props: {
              label: '关联组件'
            },
            expressions: {
              hide: `model.menuType!=='M'`
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
            type: 'ref-template',
            key: 'icon',
            props: {
              label: '图标',
              refName: 'iconTemplate'
            },
            expressions: {
              hide: f => f.model.menuType === 'B'
            },
            wrappers: ['field-wrapper']
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

interface Menu {
  componentName?: string;
  desc?: string;
  icon?: string;
  id: string;
  /**
   * 0 隐藏 1 显示
   */
  isShow: 0 | 1;
  keepAlive: 0 | 1;
  name: string;
  permission?: string;
  pid?: string;
  sort: number;
  url?: string;
  menuType: 'M' | 'D' | 'B';
  children: Menu[];

  // 树结构需要的属性
  isLeaf: boolean;
  expand: boolean;
  disabled: boolean;
  parent?: Menu;
}
