import { Component, OnInit } from '@angular/core';

import { LogoutService } from '@xmagic/nzx-antd/http-interceptor';

import { EnvService } from '@commons/service/env.service';
import { UserInfo } from '@commons/service/user-info';
import { UserService } from '@commons/service/user.service';

import { UpdatePasswordService } from '../update-password/update-password.service';
import { first } from 'rxjs';

@Component({
  selector: 'np-header-username',
  templateUrl: './header-username.component.html',
  styleUrls: ['./header-username.component.less'],
  host: {
    '[class.header-action-item]': 'true'
  }
})
export class HeaderUsernameComponent implements OnInit {
  userInfo?: UserInfo;
  constructor(
    private updatePasswordService: UpdatePasswordService,
    private notifyService: LogoutService,
    private userService: UserService,
    public env: EnvService
  ) {}

  ngOnInit(): void {
    this.userService
      .getUserInfo()
      .pipe(first())
      .subscribe(info => (this.userInfo = info));
  }

  updateUserInfo(): void {}

  updatePassword(): void {
    this.updatePasswordService.showPasswordDialog().subscribe(() => this.notifyService.logout({ timeout: false }));
  }

  logout(): void {
    this.userService.logout().subscribe(() => this.notifyService.logout({ timeout: false }));
  }
}
