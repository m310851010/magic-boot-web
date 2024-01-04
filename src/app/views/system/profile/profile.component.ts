import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserInfo } from '@commons/service/user-info';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { HttpClient } from '@angular/common/http';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { DicService } from '@xmagic/nzx-antd/service';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzCheckboxModule } from '@xmagic/nz-formly/checkbox';
import { NzxFormUtils, NzxUtils } from '@xmagic/nzx-antd/util';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'ma-profile',
  standalone: true,
  imports: [
    CommonModule,
    NzCardModule,
    NzIconModule,
    NzxPipeModule,
    FormlyModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    FormlyNzInputModule,
    FormlyNzFormFieldModule,
    FormlyNzGridModule,
    FormlyNzCheckboxModule,
    NzButtonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export default class ProfileComponent {
  userProps: UserProp[] = [
    { label: '用户名称', icon: 'user', prop: 'username' },
    { label: '手机号码', icon: 'phone', prop: 'phone' },
    { label: '用户邮箱', icon: 'mail', prop: 'email' },
    { label: '所属部门', icon: 'apartment', prop: 'officeName' },
    { label: '所属角色', icon: 'apartment', prop: 'roleNames' },
    { label: '创建日期', icon: 'calendar', prop: 'createDate' }
  ];

  form = new FormGroup({});
  model: Partial<UserInfo> = {};
  fields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      props: {
        label: '用户昵称',
        maxLength: 64
      }
    },
    {
      type: 'input',
      key: 'phone',
      props: {
        label: '手机号码'
      },
      validators: {
        validation: [NzxFormUtils.mobile()]
      }
    },
    {
      type: 'input',
      key: 'email',
      props: {
        label: '邮箱',
        maxLength: 128
      },
      validators: {
        validation: [NzxFormUtils.email()]
      }
    },
    {
      type: 'checkbox',
      key: 'sex',
      props: {
        label: '性别',
        nzxMultiple: false,
        options: this.dicService.getDic('SEX')
      }
    }
  ];

  constructor(
    private http: HttpClient,
    private dicService: DicService,
    private messageService: NzMessageService
  ) {
    this.http.get<UserInfo>('/system/user/detail').subscribe(info => {
      for (const item of this.userProps) {
        item.value = info[item.prop];
      }
      this.model = { phone: info.phone, email: info.email, id: info.id, sex: info.sex, name: info.name };
    });
  }

  onSaveClick(): void {
    if (!this.form.valid) {
      return;
    }

    this.http
      .post('/system/user/center/update', {
        ...this.model,
        sex: NzxUtils.isArray(this.model.sex) ? this.model.sex[0] : this.model.sex
      })
      .subscribe(() => {
        this.messageService.success('修改成功');
      });
  }
}

interface UserProp {
  label: string;
  icon: string;
  prop: keyof UserInfo;
  value?: any;
}
