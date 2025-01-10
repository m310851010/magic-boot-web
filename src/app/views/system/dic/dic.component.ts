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
import { FormlyNzSelectModule } from '@xmagic/nz-formly/select';
import { FormlyNzTextareaModule } from '@xmagic/nz-formly/textarea';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxHttpInterceptorModule } from '@xmagic/nzx-antd/http-interceptor';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxModalOptions } from '@xmagic/nzx-antd/modal/nzx-modal.service';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { DicService } from '@xmagic/nzx-antd/service';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxFormUtils, NzxUtils } from '@xmagic/nzx-antd/util';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { SearchPipe } from '@commons/component/search.pipe';
import { CommonService, DeleteButton } from '@commons/service';

import { getMaxSort } from '../menu/menu-utils';
import { FormlyNzDatePickerModule } from '@xmagic/nz-formly/date-picker';
import { FormlyNzTimePickerModule } from '@xmagic/nz-formly/time-picker';
import { dicMapLabel } from '@commons';

@Component({
  selector: 'ma-dic',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormlyModule,
    FormlyNzInputModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzRadioModule,
    FormlyNzTextareaModule,
    FormlyNzSelectModule,
    FormlyNzDatePickerModule,
    FormlyNzTimePickerModule,
    FormlyModule,
    NzFormModule,
    NzButtonModule,
    NzCardModule,
    NzInputModule,
    FormsModule,
    NzxTableModule,
    NzxDirectiveModule,
    NzIconModule,
    NzTagModule,
    NzxHttpInterceptorModule,
    FormlyCommonModule,
    NzAvatarModule,
    NzSpaceModule,
    NzEmptyModule,
    SearchPipe,
    NzxPipeModule,
    NzDropDownModule
  ],
  templateUrl: './dic.component.html',
  styleUrl: './dic.component.less'
})
export default class DicComponent implements OnInit {
  @ViewChild('modalTemplate') modalTemplate!: TemplateRef<{}>;
  @ViewChild('table') table!: NzxTableComponent<Dict>;

  selected?: Dict;
  modalForm = new FormGroup({});
  modalModel: Partial<Dict> = {};
  modalFields: FormlyFieldConfig[] = [];

  getParams: () => Partial<Dict> = () => {
    return { pid: this.selected!.id };
  };

  columns: NzxColumn<Dict>[] = [
    { nzShowCheckAll: true, nzShowCheckbox: true },
    { name: 'label', thText: '字典名称' },
    {
      name: 'value',
      thText: '字典值',
      format: v => (this.selected?.dataType === 2 ? this.yn$.pipe(dicMapLabel(v)) : v)
    },
    { name: 'status', thText: '状态', tdTemplate: 'status', nzWidth: '70px' },
    { name: 'extJson', thText: '扩展json' },
    { name: 'sort', thText: '排序号', nzWidth: '70px' },
    { name: 'createDate', thText: '创建时间', nzWidth: '170px' },
    {
      name: 'id',
      thText: '操作',
      nzWidth: '120px',
      buttons: [
        {
          text: '修改',
          permission: 'dict:update',
          click: (row: Dict) => this.onUpdateDicItemOpenModal(row, this.modalTemplate, this.table)
        },
        {
          ...DeleteButton,
          permission: 'dict:delete',
          click: (row: Dict) => this.onItemDeleteClick(row, this.table)
        }
      ]
    }
  ];

  afterFetch = (resp: any) => {
    resp.list.forEach((item: any) => {
      console.log(item);
    });
    return {};
  };
  searchText = '';
  rootDic: Dict[] = [];

  dicType$ = this.dicService.getDic('DICT_TYPE');
  dataType$ = this.dicService.getDic('DATA_TYPE');
  status$ = this.dicService.getDic('STATUS');
  yn$ = this.dicService.getDic('YN').pipe(map(ls => ls.map(v => ({ label: v.label, value: `${v.value}` }))));

  constructor(
    private http: HttpClient,
    private commonService: CommonService,
    private dicService: DicService,
    private modalService: NzxModalService,
    private messageService: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.http.post<Dict[]>('/system/dict/list', { pid: '0' }).subscribe(list => {
      this.rootDic = list;
      if (this.selected) {
        this.selected = list.find(v => v.id === this.selected!.id);
      }
    });
  }

  onDicClick(item?: Dict): void {
    if (item === this.selected) {
      return;
    }
    this.selected = item;
    if (this.table) {
      this.table.refresh(true);
    }
  }

  onRootDicDeleteClick(evt: MouseEvent, row: Dict): void {
    evt.stopPropagation();

    this.commonService
      .handleDelete({
        id: row.id,
        url: '/system/dict/delete',
        params: { pid: row.pid },
        message: `字典 "${row.label}" 及其字典项删除后不可恢复, 确定删除?`
      })
      .then(() => this.loadData());
  }

  onItemDeleteClick(row: Dict, table: NzxTableComponent): void {
    this.handleDelete(row.id, table).then();
  }

  onItemBatchDelete(table: NzxTableComponent): void {
    const id = table.nzData.filter(v => v.checked).map(v => v.id);
    if (!id.length) {
      this.messageService.error('请选择至少一条字典项 ');
      return;
    }
    this.handleDelete(id, table, '选中的字典项删除后不可恢复, 确定删除?').then();
  }

  private handleDelete(id: string | string[], table: NzxTableComponent, message?: string): Promise<boolean> {
    return this.commonService.handleDelete({
      id,
      url: '/system/dict/delete',
      message,
      params: { pid: this.selected!.id },
      table
    });
  }

  onNewRootDicOpenModal(nzContent: TemplateRef<{}>): void {
    this.openModal(
      { pid: '0', sort: getMaxSort(this.rootDic) },
      {
        nzTitle: '新增字典',
        nzContent,
        fields: this.getRootDicFields(),
        nzOnOk: () =>
          firstValueFrom(this.http.post('/system/dict/save', this.modalModel).pipe(tap(() => this.loadData())))
      }
    );
  }

  onUpdateRootDicOpenModal(evt: MouseEvent, row: Dict, nzContent: TemplateRef<{}>): void {
    evt.stopPropagation();

    this.openModal(row, {
      nzTitle: '修改字典',
      nzContent,
      fields: this.getRootDicFields(),
      nzOnOk: () =>
        firstValueFrom(this.http.post('/system/dict/update', this.modalModel).pipe(tap(() => this.loadData())))
    });
  }

  private getRootDicFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'radio',
        key: 'dictType',
        defaultValue: 0,
        props: {
          label: '字典类型',
          required: true,
          options: this.dicType$
        }
      },
      {
        type: 'select',
        key: 'dataType',
        defaultValue: 0,
        props: {
          label: '数据类型',
          required: true,
          options: this.dataType$
        }
      }
    ];
  }

  onNewDicItemOpenModal(nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(
      { pid: this.selected!.id, sort: getMaxSort(table.nzData) },
      {
        nzTitle: '新增字典项',
        nzContent,
        table,
        nzOnOk: (_, model) => {
          return firstValueFrom(this.http.post('/system/dict/save', model));
        }
      }
    );
  }

  onUpdateDicItemOpenModal(model: Partial<Dict>, nzContent: TemplateRef<{}>, table: NzxTableComponent): void {
    this.openModal(model, {
      nzTitle: '修改字典项',
      nzContent,
      table,
      nzOnOk: (_, model) => firstValueFrom(this.http.post('/system/dict/update', model))
    });
  }

  private openModal(
    model: Partial<Dict>,
    options: Omit<NzxModalOptions<NzSafeAny, TemplateRef<{}>>, 'nzOnOk'> & {
      nzOnOk: (instance: NzSafeAny, model: Record<string, any>) => Promise<false | void | {}>;
      fields?: FormlyFieldConfig[];
      table?: NzxTableComponent;
    }
  ): void {
    const validators = {
      validation: [
        (control: AbstractControl) => {
          if (!control.value) {
            return null;
          }
          let list: Dict[];
          // 字典项
          if (options.table) {
            list = options.table.nzData || [];
          } else {
            list = this.rootDic || [];
          }

          // 编辑时有ID
          if (model.id) {
            list = list.filter(v => v.id !== model.id);
          }

          if (list.some(v => v.value === control.value)) {
            return { exists: { message: '字典值已经存在,请换一个' } };
          }
          return null;
        }
      ]
    };

    let valueField: FormlyFieldConfig = {
      type: 'input',
      key: 'value',
      props: {
        label: '字典值',
        maxLength: 64,
        required: true
      },
      validators
    };

    // 字典项
    if (options.table) {
      const type = { 0: 'input', 1: 'number', 2: 'radio', 3: 'date-picker', 4: 'time-picker' }[this.selected!.dataType];
      valueField = {
        type,
        key: 'value',
        props: {
          label: '字典项值',
          maxLength: 64,
          options: this.yn$,
          required: true
        },
        validators
      };
    }

    this.modalForm = new FormGroup({});
    this.modalModel = NzxUtils.clone(model);
    if (options.table && this.modalModel.value) {
      if (this.selected?.dataType === 3) {
        const _vs = (this.modalModel.value as string).split('-').map(v => +v.trim());
        this.modalModel.value = new Date(_vs[0], _vs[1], _vs[2])!;
      } else if (this.selected?.dataType === 4) {
        const _vs = (this.modalModel.value as string).split(':').map(v => +v.trim());
        this.modalModel.value = new Date(2025, 1, 1, _vs[0], _vs[1], _vs[2])!;
      }
    }

    console.log(this.modalModel);
    console.log(model);

    this.modalFields = [
      {
        type: 'row',
        fieldGroup: [
          ...(options.fields || []),
          {
            type: 'input',
            key: 'label',
            props: {
              label: options.table ? '字典项名' : '字典名',
              maxLength: 64,
              required: true
            }
          },
          valueField,
          {
            type: 'radio',
            key: 'status',
            defaultValue: 0,
            props: {
              label: '状态',
              options: this.status$,
              required: true
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
      },
      {
        type: 'textarea',
        key: 'extJson',
        props: {
          label: '扩展JSON',
          rows: 4,
          maxLength: 1000,
          nzMaxCharacterCount: 1000
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

        const model = { ...this.modalModel };
        // 字典项
        if (options.table && NzxUtils.isDate(model.value)) {
          if (this.selected?.dataType === 3) {
            model.value = NzxUtils.formatDate(model.value as Date, 'yyyy-MM-dd');
          } else if (this.selected?.dataType === 4) {
            model.value = NzxUtils.formatDate(model.value as Date, 'HH:mm:ss');
          }
        }

        return options.nzOnOk(instance, model).then(v => {
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
 * 字典
 */

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
  value: string | Date | number | boolean;
  /**
   * 字典类型：0系统类，1业务类, 字典 DICT_TYPE
   */
  dictType: 0 | 1;
  /**
   * 排序号
   */
  sort: number;
  /**
   * 数据类型,0:string 1: number 2:boolean 3:date 4:time
   */
  dataType: 0 | 1 | 2 | 3 | 4;
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
