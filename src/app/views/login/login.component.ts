import { NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { HttpError } from '@xmagic/nzx-antd/http-interceptor';
import { NzxFormUtils } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

import { InputPasswordComponent } from '@commons/component/input-password';

import { LoginService, CaptchaInfo } from './login.service';

@Component({
  selector: 'np-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzxDirectiveModule,
    NzButtonModule,
    NzCheckboxModule,
    InputPasswordComponent
  ],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  captcha?: CaptchaInfo;
  constructor(
    protected fb: FormBuilder,
    protected router: Router,
    protected loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: ['admin', [Validators.required]],
      password: ['000000', [Validators.required]],
      verifyCode: ['', [Validators.required]],
      rememberMe: [true]
    });
    this.changeCaptcha();
  }

  /**
   * 提交表单
   */
  submitForm(): void {
    if (!NzxFormUtils.validate(this.validateForm, { updateValueAndValidity: true })) {
      return;
    }
    this.loginService.login({ ...this.validateForm.value, ...this.captcha }).subscribe({
      next: () => this.router.navigate(['/']),
      error: (error: HttpError) => {
        console.log(error);
        if (!error.httpError) {
          this.changeCaptcha();
        }
      }
    });
  }

  /**
   * 切换验证码
   */
  changeCaptcha(): void {
    this.captcha = undefined;
    this.loginService.getCaptcha().subscribe(value => (this.captcha = value));
  }
}
