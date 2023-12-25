import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

import { BaseControl, NzxUtils } from '@xmagic/nzx-antd/util';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzPopoverModule } from 'ng-zorro-antd/popover';

@Component({
  selector: 'ma-icon-picker',
  standalone: true,
  imports: [CommonModule, NzInputModule, NzIconModule, FormsModule, NzPopoverModule, NzEmptyModule, NzPaginationModule],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.less',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconPickerComponent),
      multi: true
    }
  ]
})
export class IconPickerComponent extends BaseControl<string> implements OnInit, OnChanges, ControlValueAccessor {
  value = '';
  searchText = '';
  _iconNames: string[] = [];
  iconPageData: string[] = [];
  pageIndex = 1;
  pageSize = 48;
  nzTotal = 0;

  @Input() iconNames: string[] = [];
  @Input() isDisabled = false;
  @Input() placeholder?: string = '请选择图标';

  ngOnInit(): void {
    if (!this.iconNames.length) {
      import('./ant-icons').then(v => this.initPage(v.antIcons));
    } else {
      this.initPage(this.iconNames);
    }
  }

  private initPage(iconNames: string[]): void {
    this.iconNames = iconNames;
    this._iconNames = [...iconNames];
    this.nzTotal = this._iconNames.length;
    this.resolvePageData();
  }

  onPageIndexChange(): void {
    this.iconPageData = this._iconNames.slice((this.pageIndex - 1) * this.pageSize, this.pageIndex * this.pageSize);
  }

  private resolvePageData(): void {
    if (this.value) {
      const index = this._iconNames.indexOf(this.value);

      if (index) {
        this.pageIndex = Math.floor(index / this.pageSize) + 1;
        this.onPageIndexChange();
        return;
      }
    }
    this.pageIndex = 1;
    this.onPageIndexChange();
  }

  writeValue(value: string): void {
    this.value = value;
    this.resolvePageData();
  }

  onInputClear(): void {
    this.setIconValue('');
  }

  onSearchTextChange(text: string): void {
    this.searchText = text;
    this.pageIndex = 1;
    const value = NzxUtils.trim(text).toLowerCase();
    if (value) {
      this._iconNames = this.iconNames.filter(v => v.toLowerCase().includes(value));
    } else {
      this._iconNames = [...this.iconNames];
    }
    this.nzTotal = this._iconNames.length;
    this.onPageIndexChange();
  }

  onVisibleChange(visible: boolean): void {
    if (!visible) {
      return;
    }

    this.searchText = '';
    this.initPage(this.iconNames);
  }

  onIconItemClick(icon: string): void {
    this.setIconValue(icon);
  }

  override setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { iconNames } = changes;
    if (iconNames && !iconNames.isFirstChange()) {
      this.initPage(this.iconNames);
    }
  }

  private setIconValue(value: string): void {
    this.value = value;
    this.onChange(value);
  }
}
