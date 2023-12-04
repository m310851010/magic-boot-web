import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';

import { NzxFormUtils } from '@xmagic/nzx-antd/util';

@Component({
  selector: 'np-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.less']
})
export class UpdatePasswordComponent implements OnInit {
  validateForm!: FormGroup;
  constructor(protected http: HttpClient) {}

  getMessage = NzxFormUtils.getMessage;

  ngOnInit(): void {
    this.validateForm = new FormGroup({
      password: new FormControl(null, [NzxFormUtils.required('请输入旧密码')]),
      newPassword: new FormControl(null, [
        NzxFormUtils.required('请输入新密码'),
        this.equalValidator('confirmPassword')
      ]),
      confirmPassword: new FormControl(null, [
        NzxFormUtils.required('请输入确认密码'),
        this.equalValidator('newPassword')
      ])
    });
  }

  submitForm(): Observable<boolean> {
    if (!NzxFormUtils.validate(this.validateForm)) {
      return of(false);
    }
    return this.http.post<boolean>('/system/password', null);
  }

  /**
   * 验证新密码和确认密码是否相同
   * @param type 验证字段
   */
  equalValidator(type: 'newPassword' | 'confirmPassword'): (control: AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return NzxFormUtils.equalControl(this.validateForm, type, '新密码和确认密码必须相同')(control);
    };
  }
}
