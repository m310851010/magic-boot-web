import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom, map } from 'rxjs';
import { tap } from 'rxjs/operators';

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
import { NzxModalService, NzxModalOptions } from '@xmagic/nzx-antd/modal';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { DicItem, DicService, FetcherService } from '@xmagic/nzx-antd/service';
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
import { CommonService } from '@commons/service/common.service';
import { dicMap } from '@commons/utils';

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
    FormlyCommonModule
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
      thText: '菜单类型',
      tdTemplate: 'menuTypeTemplate'
    },
    {
      name: 'componentName',
      thText: '组件'
    },
    {
      name: 'openMode',
      thText: '打开方式',
      format: data => (data == null ? '--' : data ? '新标签页' : 'iframe')
    },
    {
      name: 'isShow',
      thText: '是否显示',
      format: isShow => (isShow ? '是' : '否')
    },
    {
      name: 'id',
      thText: '操作',
      buttons: [
        {
          text: '新增下级',
          permission: 'menu:save',
          visible: (row: Menu) => row.menuType === 'D' || row.menuType === 'M',
          click: (row: Menu) => {
            this.onUpdateOpenModal(row, this.modalTemplate, this.table);
          }
        },
        {
          text: '修改',
          permission: 'menu:save',
          click: (row: Menu) => {
            this.onUpdateOpenModal(row, this.modalTemplate, this.table);
          }
        },
        {
          text: '删除',
          permission: 'menu:delete',
          click: (row: Menu) => {
            this.onDeleteClick(row, this.table);
          }
        }
      ],
      nzWidth: '180px'
    }
  ];

  menuTypeMap: Record<string, DicItem & { color: string }> = {};
  menuTypes: DicItem[] = [];
  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private modalService: NzxModalService,
    private fetcherService: FetcherService,
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
  }

  onUpdateOpenModal(model: Partial<Menu>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改菜单',
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
    this.commonService.handleDelete({ id, url: '/system/menu/delete', table });
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
      nzOnOk: () => firstValueFrom(this.http.post('/system/menu/save', this.modalModel))
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
        },
        wrappers: ['field-wrapper']
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
              options: this.menus$.pipe(
                map(list => {
                  const nodes = [...list];
                  if (model.menuType === 'D') {
                    const dNode = nodes.find(v => v.id === model.id);
                    if (dNode) {
                      dNode['isLeaf'] = true;
                      dNode.children = [];
                    }
                  }
                  NzxUtils.forEachTree(nodes, node => {
                    if (node.children) {
                      node.children = [...node.children];
                    }

                    if (node.id === model.id) {
                      node['disabled'] = true;
                    }

                    node['title'] = node.name;
                    node['key'] = node.id;
                    if (node.menuType === 'D') {
                      return true;
                    }
                    if (node.menuType === 'M') {
                      node['isLeaf'] = true;
                      node.children = [];
                      return true;
                    }
                    return false;
                  });

                  return nodes;
                })
              )
            }
          },
          {
            type: 'input',
            key: 'url',
            props: {
              label: '路径',
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
                  return { menuUrl: { message: '路径只能以"http://" "https://"或"/"开头' } };
                }
              ]
            },
            expressions: {
              hide: `model.menuType==='D' || model.menuType=='B'`
            }
          },
          {
            type: 'input',
            key: 'icon',
            props: {
              label: '图标'
            },
            expressions: {
              hide: `model.menuType==='B'`
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
              hide: `model.menuType!=='B'`
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
              hide: `!(model.menuType==='I' || model.menuType==='O')`
            }
          },
          {
            type: 'radio',
            key: 'isShow',
            defaultValue: 1,
            props: {
              label: '是否显示',
              options: [
                { value: 1, label: '是' },
                { value: 0, label: '否' }
              ]
            },
            expressions: {
              hide: `model.menuType==='B'`
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
            },
            expressions: {
              hide: `model.menuType==='B'`
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
  menuType: 'M' | 'D' | 'B' | 'O' | 'I';
  children: Menu[];

  [key: string]: NzSafeAny;
}
