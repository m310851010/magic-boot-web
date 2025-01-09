import { NgIf } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { NzxCheckboxModule, NzxCheckboxOption } from '@xmagic/nzx-antd/checkbox';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';

@Component({
  selector: 'ma-input-type',
  standalone: true,
  imports: [
    NzInputModule,
    NgIf,
    FormsModule,
    NzInputNumberModule,
    NzxCheckboxModule,
    NzSelectModule,
    NzDatePickerModule
  ],
  template: `
    <nz-input-group nzCompact style="display: flex">
      <input
        nz-input
        *ngIf="_dataType === 'string'"
        [attr.placeholder]="placeholder ?? ''"
        [(ngModel)]="_value"
        (ngModelChange)="onModelChange($event)"
      />

      <nz-input-number
        class="flex-main"
        *ngIf="_dataType === 'number'"
        [(ngModel)]="_value"
        (ngModelChange)="onModelChange($event)"
        (focus)="onTouched()"
        [nzPlaceHolder]="placeholder ?? ''"
      ></nz-input-number>

      <nzx-checkbox
        style="line-height: 32px;"
        class="flex-main text-center nowrap"
        *ngIf="_dataType === 'boolean'"
        [nzxOptions]="options"
        [nzxMultiple]="false"
        [(ngModel)]="_value"
        (nzxFocus)="onTouched()"
        (ngModelChange)="onModelChange($event)"
      ></nzx-checkbox>

      <nz-date-picker
        *ngIf="_dataType === 'date'"
        class="full-width"
        [(ngModel)]="_value"
        [nzShowTime]="showTime"
        (ngModelChange)="onModelChange($event)"
        (focus)="onTouched()"
        [nzPlaceHolder]="placeholder ?? ''"
      ></nz-date-picker>

      <nz-select
        *ngIf="showDataType !== false"
        style="width: 74px"
        [nzOptions]="menuItems"
        [(ngModel)]="_dataType"
        (ngModelChange)="onDataTypeChange($event)"
      ></nz-select>
    </nz-input-group>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTypeComponent),
      multi: true
    }
  ]
})
export class InputTypeComponent implements ControlValueAccessor, OnInit {
  _value: ValueType = null;
  private _dataTypeMap = {
    string: '字符',
    number: '数字',
    boolean: '布尔',
    date: '日期'
  };
  menuItems: NzxCheckboxOption[] = [];

  @Input() disabled: boolean = false;
  @Input() placeholder?: string = '';
  /**
   * 是否显示时间选择器
   */
  @Input() showTime = false;

  _dataType?: InputTypesType;
  @Input() set dataType(value: InputTypesType) {
    if (!value) {
      return;
    }
    this._dataType = value;
    if (this._value == null) {
      return;
    }
    const _value = this.convertValue(this._value, value);
    this.onModelChange(_value);
  }

  get dataType(): InputTypesType {
    return this._dataType!;
  }

  @Input() showDataType?: boolean;

  _dataTypes: InputTypesType[] = [];
  @Input() set dataTypes(value: InputTypesType[]) {
    if (!value) {
      return;
    }
    this._dataTypes = value;
    this.menuItems = value.map(item => ({
      label: this._dataTypeMap[item],
      value: item
    }));
  }
  get dataTypes(): InputTypesType[] {
    return this._dataTypes;
  }

  @Input() dataTypeChange = new EventEmitter<InputTypesType>();

  onChange: (value: ValueType) => void = () => null;
  onTouched: () => void = () => null;

  options: NzxCheckboxOption[] = [
    { label: '是', value: true },
    { label: '否', value: false }
  ];

  constructor() {
    this._dataType ??= 'string';
    this.dataTypes = Object.keys(this._dataTypeMap) as InputTypesType[];
  }

  ngOnInit(): void {}

  writeValue(value: ValueType): void {
    this._value = null;
    this._dataType = 'string';

    if (value == null) {
      return;
    }
    const dataType = typeof value as InputTypesType;
    const isDate = NzxUtils.isDate(value);
    if (!this._dataTypeMap[dataType] && !isDate) {
      return;
    }

    this._dataType = isDate ? 'date' : dataType;
    this._value = value;
    this._value = this.convertValue(value, this._dataType);
  }

  registerOnChange(fn: (_: ValueType) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onModelChange(_value: ValueType): void {
    this._value = _value;
    this.onChange(_value);
  }

  onDataTypeChange(dataType: InputTypesType): void {
    this.dataTypeChange.emit(dataType);
    if (this._value == null) {
      return;
    }

    const _value = this.convertValue(this._value, dataType);
    this.onModelChange(_value);
  }

  private convertValue(value: ValueType, dataType: InputTypesType): ValueType {
    if (dataType === 'boolean') {
      value = !!value;
    } else if (dataType === 'number') {
      // 如果是数字类型，将值转换为数字如果不是则转成null
      const num = Number(this._value);
      value = isNaN(num) ? null : num;
    } else if (dataType === 'date') {
      // 如果是日期类型，将值转换为日期对象
      if (value instanceof Date) {
        return value;
      }
      value = NzxUtils.toDate(value as string | number | Date);
    }
    return value;
  }
}

export type InputTypesType = 'string' | 'boolean' | 'number' | 'date';
export type ValueType = string | boolean | number | Date | null;
