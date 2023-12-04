import { Component, OnDestroy, OnInit } from '@angular/core';

import { LogoutService } from '@xmagic/nzx-antd/http-interceptor';

import { UserInfo } from '@commons/service/user-info';
import { UserService } from '@commons/service/user.service';

import { UpdatePasswordService } from '../update-password/update-password.service';

@Component({
  selector: 'np-header-username',
  templateUrl: './header-username.component.html',
  styleUrls: ['./header-username.component.less'],
  host: {
    '[class.header-action-item]': 'true'
  }
})
export class HeaderUsernameComponent implements OnInit, OnDestroy {
  userInfo?: UserInfo;
  constructor(
    private updatePasswordService: UpdatePasswordService,
    private notifyService: LogoutService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getUserInfo().subscribe(info => (this.userInfo = info));
  }

  updateUserInfo(): void {}

  updatePassword(): void {
    this.updatePasswordService.showPasswordDialog().subscribe(() => this.notifyService.logout({ timeout: false }));
  }

  logout(): void {
    this.userService.logout().subscribe(() => this.notifyService.logout({ timeout: false }));
  }

  ngOnDestroy(): void {
    this.userService.clearUserInfo();
  }
}
