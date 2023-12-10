import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ma-page-progress',
  exportAs: 'pageProgress',
  templateUrl: './page-progress.component.html',
  styleUrls: ['./page-progress.component.less']
})
export class PageProgressComponent implements OnInit, OnDestroy {
  private startValue = 2;
  private destroy$ = new Subject<void>();
  /**
   * 线宽
   */
  @Input() lineWidth = 2;
  @Input() autoStart = true;
  value = this.startValue;
  show = true;

  constructor() {}

  ngOnInit(): void {
    if (this.autoStart) {
      this.start();
    }
  }

  start(): void {
    this.show = true;
    this.value = this.startValue;
    // 先停止之前的定时器
    takeUntil(this.destroy$);

    timer(200, 200)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const ret = this.value + Math.random() * 5 + 3;
        if (ret >= 99.5) {
          this.value = 99.5;
          this.stopTimer();
        } else {
          this.value = ret;
        }
      });
  }

  done(): void {
    this.stopTimer();
    this.value = 100;
    setTimeout(() => (this.show = false), 200);
  }

  remove(): void {
    this.stopTimer();
    this.show = false;
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private stopTimer(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
