import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs';

import { LogoutService } from '@xmagic/nzx-antd/http-interceptor';

import { EnvService, UserInfo, UserService } from '@commons/service';

import { UpdatePasswordService } from '../update-password/update-password.service';

@Component({
  selector: 'ma-header-username',
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

  updatePassword(): void {
    this.updatePasswordService.showPasswordDialog().subscribe(() => this.notifyService.logout({ timeout: false }));
  }

  logout(): void {
    this.userService.logout().subscribe(() => this.notifyService.logout({ timeout: false }));
  }
}
