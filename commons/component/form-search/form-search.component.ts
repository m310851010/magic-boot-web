import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { NzxTableComponent } from '@xmagic/nzx-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpaceModule } from 'ng-zorro-antd/space';

@Component({
  selector: 'ma-form-search',
  standalone: true,
  imports: [CommonModule, NzButtonModule, NzSpaceModule, NzIconModule],
  templateUrl: './form-search.component.html',
  styleUrl: './form-search.component.less',
  host: {
    '[class.full-width]': 'true'
  }
})
export class FormSearchComponent {
  /**
   * 现实重置
   */
  @Input() showReset = true;
  /**
   * 显示查询按钮
   */
  @Input() showSearch = true;
  /**
   * 显示箭头
   */
  @Input() showArrow = false;
  @Input() form?: AbstractControl;
  @Input() table?: NzxTableComponent;
  @Input() collapsed = true;
  @Input() buttonAlignRight = true;
  @Output() collapsedChange = new EventEmitter<boolean>();
  @Output() searchClick = new EventEmitter<MouseEvent>();
  @Output() resetClick = new EventEmitter<MouseEvent>();

  onToggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.collapsedChange.emit(this.collapsed);
  }
}
