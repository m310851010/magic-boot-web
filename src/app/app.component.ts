import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { LogoutService } from '@xmagic/nzx-antd/http-interceptor';
import { NzxModalModule, NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { MenuInfoService, UserService } from '@commons/service';

@Component({
  selector: 'ma-root',
  standalone: true,
  imports: [RouterOutlet, NzxModalModule, NzButtonModule],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  constructor(
    private modalService: NzxModalService,
    private notifyService: LogoutService,
    private userService: UserService,
    private menuService: MenuInfoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notifyService.onLogout(error => {
      this.userService.clearCache();
      this.menuService.clearCache();
      this.modalService.closeAll();

      if (error.timeout) {
        this.modalService
          .info({ nzContent: error.message || '登录超时，请重新登录' })
          .afterClose.subscribe(() => this.toLogin());
      } else {
        this.toLogin();
      }
    });
  }

  private toLogin(): void {
    this.router.navigate(['/login']).then();
  }
}
