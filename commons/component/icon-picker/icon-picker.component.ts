import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseControl } from '@xmagic/nzx-antd/util';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'ma-icon-picker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.less',
  providers: []
})
export class IconPickerComponent extends BaseControl<string> implements ControlValueAccessor {
  value?: string;
  writeValue(value: string) {
    this.value = value;
  }
}
