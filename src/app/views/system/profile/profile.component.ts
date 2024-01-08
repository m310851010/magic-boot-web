import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { first, firstValueFrom, mergeMap, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyNzCheckboxModule } from '@xmagic/nz-formly/checkbox';
import { FormlyNzFormFieldModule } from '@xmagic/nz-formly/field-wrapper';
import { FormlyNzGridModule } from '@xmagic/nz-formly/grid';
import { FormlyNzInputModule } from '@xmagic/nz-formly/input';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { DicService } from '@xmagic/nzx-antd/service';
import { NzxFormUtils } from '@xmagic/nzx-antd/util';
import Cropper from 'cropperjs';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';

import { EnvService } from '@commons/service/env.service';
import { UserInfo } from '@commons/service/user-info';
import { UserService } from '@commons/service/user.service';
import { blobToB64, getFileInfo } from '@commons/utils';

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
    NzButtonModule,
    NzAvatarModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.less'
})
export default class ProfileComponent {
  @ViewChild('imageRef') imageRef!: ElementRef<HTMLImageElement>;
  userProps: UserProp[] = [
    { label: '用户名称', icon: 'user', prop: 'username' },
    { label: '手机号码', icon: 'phone', prop: 'phone' },
    { label: '用户邮箱', icon: 'mail', prop: 'email' },
    { label: '所属部门', icon: 'apartment', prop: 'officeName' },
    { label: '所属角色', icon: 'safety-certificate', prop: 'roleNames' },
    { label: '创建时间', icon: 'calendar', prop: 'createDate' }
  ];

  imageSize = 200;

  form = new FormGroup({});
  model: UserInfo = {} as UserInfo;
  fields: FormlyFieldConfig[] = [
    {
      type: 'input',
      key: 'name',
      props: {
        label: '姓名',
        maxLength: 64
      }
    },
    {
      type: 'input',
      key: 'nickName',
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
        nzxRequired: false,
        options: this.dicService.getDic('SEX')
      }
    }
  ];

  private userDetail: UserInfo & { filename: string } = {} as UserInfo & { filename: string };

  avatar!: string;
  cropperImage!: string;
  filename!: string;
  cropper!: Cropper;
  scaleX = 1;
  scaleY = 1;
  constructor(
    private http: HttpClient,
    private dicService: DicService,
    private modalService: NzxModalService,
    private messageService: NzMessageService,
    private env: EnvService,
    private userService: UserService
  ) {
    this.http.get<UserInfo>('/system/user/detail').subscribe(info => {
      for (const item of this.userProps) {
        item.value = info[item.prop];
      }
      this.model = info;
      this.userDetail = { ...info, filename: '' };

      if (info.avatar) {
        this.avatar = this.env.basePath + info.avatar;
        this.cropperImage = this.avatar;
        this.userDetail.filename = getFileInfo(info.avatar)!.filename;
        return;
      }

      // 请求默认头像
      const text = info.name || info.username;
      this.userDetail.filename = `${text}.png`;

      this.http
        .get('/system/file/avatar', { observe: 'response', responseType: 'blob', params: { text } })
        .subscribe(resp => {
          blobToB64(resp.body!).then(value => (this.avatar = value as string));
        });
    });
  }

  onFileChange(evt: Event): void {
    const input = evt.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }

    const file = input.files.item(0)!;
    if (!/^image\/\w+/.test(file.type)) {
      this.messageService.warning('请选择图片文件');
      return;
    }
    if (!/\.(gif|jpg|jpeg|png|bmp)$/i.test(file.name)) {
      this.messageService.warning('请选择gif、jpg、jpeg、png、bmp格式的图片');
      return;
    }
    this.cropperImage = URL.createObjectURL(file);
    this.filename = file.name;
    this.createCropper();
  }

  onSaveClick(): void {
    if (!this.form.valid) {
      return;
    }
    this.saveUserInfo(this.model).subscribe(() => {
      this.userDetail = { ...this.model, filename: this.userDetail.filename };
    });
  }

  private saveUserInfo(user: Partial<UserInfo>): Observable<boolean> {
    return this.http
      .post<boolean>('/system/user/center/update', user)
      .pipe(tap(() => this.messageService.success('修改成功!')));
  }

  onAvatarClick(nzContent: TemplateRef<{}>): void {
    this.filename = this.userDetail.filename!;
    this.cropperImage = this.avatar;

    const modalRef = this.modalService.create({
      nzTitle: '头像裁剪',
      nzContent,
      nzWidth: 700,
      nzBodyStyle: {
        'margin-left': '15px'
      },
      nzOnOk: () => {
        const canvas = this.cropper.getCroppedCanvas({
          width: this.imageSize,
          height: this.imageSize,
          imageSmoothingEnabled: true,
          fillColor: 'transparent'
        });
        const base64File = canvas.toDataURL('image/png');
        console.log(base64File);
        return firstValueFrom(
          this.http
            .post<string>('/system/file/upload', {
              file: base64File.substring('data:image/png;base64,'.length),
              filename: this.filename,
              bizId: this.userDetail.id,
              bizType: 'D'
            })
            .pipe(
              mergeMap(url => {
                return this.saveUserInfo({ ...this.userDetail, avatar: url }).pipe(
                  tap(() => {
                    this.deleteOldFile();
                    this.avatar = this.env.basePath + url;
                    this.model.avatar = url;
                    this.userDetail.avatar = url;
                    this.userDetail.filename = this.filename;

                    this.updateHeaderAvatar(url);
                  })
                );
              })
            )
        );
      }
    });

    this.createCropper();
    modalRef.afterClose.subscribe(() => this.destroyCropper());
    console.log();
  }

  createCropper(): void {
    this.destroyCropper();
    setTimeout(() => {
      const image = this.imageRef.nativeElement;
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        initialAspectRatio: 1,
        responsive: false,
        autoCrop: true,
        center: true,
        restore: false,
        checkCrossOrigin: false,
        guides: false,
        cropBoxResizable: false,
        dragMode: 'move',
        preview: '.img-preview',
        ready: () => this.setCropBoxData()
      });
    });
  }

  resetCropper(): void {
    this.cropper.reset();
    this.setCropBoxData();
  }

  private setCropBoxData(): void {
    this.scaleX = 1;
    this.scaleY = 1;
    this.cropper.zoomTo(1);
    const container = this.cropper.getContainerData();
    this.cropper.setCropBoxData({
      left: container.width / 2 - this.imageSize / 2,
      top: container.height / 2 - this.imageSize / 2,
      width: this.imageSize,
      height: this.imageSize
    });
  }

  private destroyCropper(): void {
    if (this.cropper) {
      this.cropper.destroy();
      // @ts-ignore
      this.cropper = null;
    }
  }

  onScaleX(): void {
    this.scaleX = this.scaleX === 1 ? -1 : 1;
    this.cropper.scaleX(this.scaleX);
  }

  onScaleY(): void {
    this.scaleY = this.scaleY === 1 ? -1 : 1;
    this.cropper.scaleY(this.scaleY);
  }

  /**
   * 更新顶部的头像
   * @param url
   * @private
   */
  private updateHeaderAvatar(url: string): void {
    this.userService
      .getUserInfo()
      .pipe(first())
      .subscribe(v => (v.avatar = url));
  }

  private deleteOldFile(): void {
    console.log();
    if (this.userDetail.avatar) {
      this.http
        .delete('/system/file/delete', {
          params: {
            bizId: this.userDetail.id,
            url: this.userDetail.avatar,
            bizType: 'D'
          }
        })
        .subscribe();
    }
  }
}

interface UserProp {
  label: string;
  icon: string;
  prop: keyof UserInfo;
  value?: any;
}
