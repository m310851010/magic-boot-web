import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { HttpLoadingService, LogoutService } from '@xmagic/nzx-antd/http-interceptor';
import { NzxModalModule, NzxModalService } from '@xmagic/nzx-antd/modal';
import { loadingService } from '@xmagic/nzx-antd/service';
import { NzButtonModule } from 'ng-zorro-antd/button';

import { UserService } from '@commons/service/user.service';

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
    private loading: HttpLoadingService,
    private notifyService: LogoutService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loading.subscribe(status => loadingService.loading(status));

    this.notifyService.onLogout(error => {
      this.userService.removeToken();
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
