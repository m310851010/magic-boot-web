import { NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BooleanInput, OnChangeType, OnTouchedType } from 'ng-zorro-antd/core/types';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';

@Component({
  selector: 'ma-input-password',
  templateUrl: './input-password.component.html',
  styleUrls: ['./input-password.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPasswordComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NzInputModule, FormsModule, NzIconModule, NgIf]
})
export class InputPasswordComponent implements OnInit, ControlValueAccessor {
  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_readOnly: BooleanInput;
  static ngAcceptInputType_customInput: BooleanInput;
  static ngAcceptInputType_nzBorderless: BooleanInput;

  /**
   * 是否显示切换按钮
   */
  @Input() toggleVisible = true;
  @Input() nzSize: 'large' | 'small' | 'default' = 'default';
  /**
   * 文本显示模式, text|明文  password|密码
   */
  @Input() textMode: 'text' | 'password' = 'password';
  @Input() placeholder = '';
  /**
   * 前缀图标
   */
  @Input() nzPrefixIcon?: string;
  /**
   * 	是否隐藏边框
   */
  @Input() nzBorderless = true;
  /**
   * 是否禁用
   */
  @Input() disabled = false;
  /**
   * 是否只读
   */
  @Input() readOnly = false;
  /**
   * 是否自定义input
   */
  @Input() customInput = false;
  value?: string;

  onChange: OnChangeType = () => {};
  onTouched: OnTouchedType = () => {};

  constructor() {}

  ngOnInit(): void {}

  onModelChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }

  registerOnChange(fn: OnChangeType): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: OnTouchedType): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  writeValue(value: string): void {
    this.value = value;
  }
}
