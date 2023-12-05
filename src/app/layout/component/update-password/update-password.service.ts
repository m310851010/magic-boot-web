import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NzxModalService } from '@xmagic/nzx-antd/modal';

import { UserService } from '@commons/service/user.service';

import { UpdatePasswordComponent } from './update-password.component';

@Injectable()
export class UpdatePasswordService {
  constructor(
    private modalService: NzxModalService,
    private userService: UserService
  ) {}

  /**
   * 打开修改密码对话框
   */
  showPasswordDialog(): Observable<void> {
    return new Observable<void>(obs => {
      const modalRef = this.modalService.create<UpdatePasswordComponent>({
        nzTitle: '修改密码',
        nzCentered: true,
        nzContent: UpdatePasswordComponent,
        nzOnOk: () => {
          modalRef
            .getContentComponent()
            .submitForm()
            .subscribe(val => {
              if (val) {
                this.userService.removeToken();
                modalRef.close();
                obs.next();
                obs.complete();
              }
            });
          return false;
        }
      });
    });
  }
}
