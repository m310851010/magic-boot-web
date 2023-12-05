import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AppInfo, Menu } from '@commons/service/user-info';

import { LayoutService } from './component/layout.service';

@Component({
  selector: 'ma-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less'
})
export class LayoutComponent implements OnInit {
  pathTraces: Menu[] = [];
  selected?: AppInfo;

  constructor(
    private layoutService: LayoutService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    activatedRoute.url.subscribe(value => {
      console.log('url:', value);
    });

    activatedRoute.queryParams.subscribe(value => {
      console.log('queryParams:', value);
    });
  }

  ngOnInit(): void {
    this.router.navigate([`/main`], { queryParams: { x: 'yyyy' } });
    this.layoutService.switchAppEvent.subscribe(app => (this.selected = app));
  }

  /**
   * 菜单点击事件
   * @param menuItem 当前点击的菜单项
   */
  handleMenuClick(menuItem: Menu): void {
    const result = this.layoutService.findMenu(menuItem.id, this.selected!.appCode);
    this.pathTraces = result || [];
    if (result) {
      this.router.navigate([`/main${result.map(v => `/${v.id}`)}`]);
    }
  }
}
