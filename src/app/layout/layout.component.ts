import { Component, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, first, map, mergeMap, takeUntil, tap } from 'rxjs';
import { MenuInfoService } from '@commons/service/menu-info.service';
import { Menu } from '@commons/service/user-info';

import { NzDestroyService } from 'ng-zorro-antd/core/services';
import { RouteData } from '@commons';
import { HttpLoadingService } from '@xmagic/nzx-antd/http-interceptor';

@Component({
  selector: 'ma-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.less',
  providers: [NzDestroyService]
})
export class LayoutComponent implements OnInit {
  pathTraces: Menu[] = [];
  routeData?: RouteData;
  loading = false;

  constructor(
    private destroy$: NzDestroyService,
    private menuService: MenuInfoService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingService: HttpLoadingService,
    private destroyRef: DestroyRef
  ) {
    this.router.events
      .pipe(
        takeUntil(this.destroy$),
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        map(v => {
          let route = this.activatedRoute.snapshot;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return { route, url: v.url };
        }),
        filter(v => v.route.outlet === 'primary'),
        mergeMap(v => {
          return this.menuService.getMenus().pipe(
            first(),
            tap(menus => {
              this.clickMenuItem(menus, v.route.data, v.url);
            }),
            map(() => v)
          );
        })
      )
      .subscribe(v => (this.routeData = v.route.data as RouteData));

    // 显示loading状态，如果不是layout子路由不会自动loading
    const loadingSub = this.loadingService.subscribe(status => this.setLoadingStatus(status));
    destroyRef.onDestroy(() => loadingSub.unsubscribe());
  }

  private setLoadingStatus(status: boolean) {
    setTimeout(() => (this.loading = status));
  }

  ngOnInit(): void {}

  clickMenuItem(menus: Menu[], routeData: RouteData, routerPath: string): void {
    if (!menus || (routeData && routeData.breadcrumb === false && routeData.leftSlider === false)) {
      return;
    }
    const result = this.findPath(menus, routerPath);
    this.pathTraces = routeData?.breadcrumb === false ? [] : result || [];
    if (result) {
      result.forEach(v => (v.open = true));
    }
  }

  findPath(tree: Menu[], url: string, path: Menu[] = []): Menu[] | undefined {
    for (const item of tree) {
      const tempPath = [...path];
      item.selected = false;
      item.open = false;

      tempPath.push(item);
      if (item.url === url) {
        setTimeout(() => (item.selected = true));
        return tempPath;
      }
      if (item.children) {
        const result = this.findPath(item.children!, url, tempPath);
        if (result) {
          return result;
        }
      }
    }
    return undefined;
  }
}
