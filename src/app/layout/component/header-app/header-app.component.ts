import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AppInfo } from '@commons/service/user-info';

import { LayoutService } from '../layout.service';

@Component({
  selector: 'np-header-app',
  templateUrl: './header-app.component.html',
  styleUrls: ['./header-app.component.less']
})
export class HeaderAppComponent implements OnInit, OnDestroy {
  /**
   * 所有应用
   */
  @Input() appInfos: AppInfo[] = [];
  /**
   * 选中的APP索引
   */
  appSelectedIndex: number | null = 0;
  private destroy$ = new Subject<void>();
  constructor(protected layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.switchAppEvent.pipe(takeUntil(this.destroy$)).subscribe(v => {
      const index = this.appInfos.findIndex(app => app.appCode === v.appCode);
      this.appSelectedIndex = index > -1 ? index : null;
    });
  }

  get hasApp(): number {
    return this.appInfos.filter(v => v.show).length;
  }

  selectedIndexChange(index: number): void {
    this.layoutService.switchAppChange(this.appInfos[index]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
