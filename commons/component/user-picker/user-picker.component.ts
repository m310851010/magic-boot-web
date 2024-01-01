import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { NzxButtonModule } from '@xmagic/nzx-antd/button';
import { NzxDirectiveModule } from '@xmagic/nzx-antd/directive';
import { NzxLayoutPageModule } from '@xmagic/nzx-antd/layout-page';
import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxColumn, NzxTableComponent, NzxTableModule } from '@xmagic/nzx-antd/table';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { FormSearchComponent } from '@commons/component/form-search';
import { UserInfo } from '@commons/service/user-info';

@Component({
  selector: 'ma-user-picker',
  templateUrl: './user-picker.component.html',
  styleUrl: './user-picker.component.less',
  standalone: true,
  imports: [
    CommonModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzxLayoutPageModule,
    NzFormModule,
    FormlyModule,
    FormSearchComponent,
    NzxTableModule,
    NzSpaceModule,
    NzxDirectiveModule,
    NzTagModule,
    NzxButtonModule,
    NzIconModule
  ]
})
export class UserPickerComponent implements OnInit, OnChanges {
  @ViewChild('userModalTemplate') userModalTemplate!: TemplateRef<{}>;
  @ViewChildren(NzxTableComponent) userTables!: QueryList<NzxTableComponent<UserInfo & { checked: boolean }>>;
  selectedUserTable!: NzxTableComponent<UserInfo & { checked: boolean }>;
  @Input() maSelectedId?: string;
  @Input({ required: true }) nzTitle!: string;
  @Input({ required: true }) maSelectedUserUrl!: string;
  @Input({ required: true }) maUnSelectedUserUrl!: string;
  @Input({ required: true }) maSaveSelectedUserUrl!: string;
  @Input() maRemoveSelectedUserUrl?: string;
  /**
   * 权限码
   */
  @Input({ required: true }) maPermission!: { addButton?: string; removeButton?: string };
  /**
   * 移除按钮的文本
   */
  @Input() maRemoveText?: string;

  @Output() maSelectedIdChange = new EventEmitter<string>();

  constructor(
    private modalService: NzxModalService,
    private messageService: NzMessageService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.openUserModal();
  }

  openUserModal(): void {
    if (!this.maSelectedId) {
      return;
    }
    const model: Record<string, any> = { id: this.maSelectedId };
    const modalRef = this.modalService.create({
      nzTitle: this.nzTitle,
      nzWidth: 1200,
      nzContent: this.userModalTemplate,
      nzData: {
        allocate: true,
        url: this.maSelectedUserUrl,
        columns: this.getUserColumns().concat(
          this.maRemoveText
            ? [
                {
                  name: 'id',
                  thText: '操作',
                  nzWidth: '80px',
                  tdTemplate: 'buttons'
                }
              ]
            : []
        ),
        getParams: () => model,
        model,
        form: new FormGroup({}),
        fields: this.getUserSearchFields()
      },
      nzCancelText: '关闭',
      nzOkText: null,
      nzBodyStyle: {
        padding: '0 3px'
      }
    });

    modalRef.afterOpen.subscribe(() => {
      this.selectedUserTable = this.userTables.get(0)!;
    });
    modalRef.afterClose.subscribe(() => {
      this.maSelectedId = undefined;
      this.maSelectedIdChange.emit(this.maSelectedId);
    });
  }

  onUnselectedUserModal(nzContent: TemplateRef<{}>): void {
    const model: Record<string, any> = { id: this.maSelectedId };
    this.modalService.create({
      nzTitle: '选择用户',
      nzWidth: 1200,
      nzContent,
      nzData: {
        allocate: false,
        url: this.maUnSelectedUserUrl,
        columns: this.getUserColumns(),
        getParams: () => model,
        model,
        form: new FormGroup({}),
        fields: this.getUserSearchFields()
      },
      nzBodyStyle: {
        padding: '0 3px'
      },
      nzOnOk: () => {
        const selectionTable = this.userTables.filter(v => v.api === this.maUnSelectedUserUrl)[0]!;
        const users = this.getUsersFromTable(selectionTable);
        return this.saveSelectedUsers(users, this.maSelectedId);
      }
    });
  }

  getUsersFromSelectedTable(): string[] {
    return this.getUsersFromTable(this.selectedUserTable);
  }

  getUsersFromTable(table: NzxTableComponent<UserInfo & { checked: boolean }>): string[] {
    const nzData = table.nzData || [];
    return nzData.filter(v => v.checked).map(v => v.id);
  }

  saveSelectedUsers(users: string[], selectedId?: string): Promise<boolean | void | {}> {
    if (!users.length) {
      this.messageService.error('请先选择用户');
      return Promise.resolve(false);
    }
    return firstValueFrom(
      this.http
        .post(this.maSaveSelectedUserUrl, { id: selectedId, users })
        .pipe(tap(() => this.selectedUserTable.refresh(true)))
    );
  }

  onBatchCancelUsers(table: NzxTableComponent): void {
    const id = table.nzData.filter(v => v.checked).map(v => v.id);
    if (!id.length) {
      this.messageService.error('请选择至少一条用户信息');
      return;
    }
    this.handleCancelUsers(id, table, `是否对选中的用户${this.maRemoveText}？`);
  }

  onCancelUsers(row: UserInfo, table: NzxTableComponent<UserInfo & { checked: boolean }>): void {
    this.handleCancelUsers(row.id, table, `确认要对用户"${row.name || row.username}" ${this.maRemoveText}？`);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { maSelectedId } = changes;
    if (maSelectedId && !maSelectedId.isFirstChange()) {
      this.openUserModal();
    }
  }

  private handleCancelUsers(userId: string | string[], table: NzxTableComponent, message: string): void {
    this.modalService.confirm({
      nzContent: message,
      nzOnOk: () => {
        this.http
          .post(this.maRemoveSelectedUserUrl!, {
            id: this.maSelectedId!,
            users: NzxUtils.isArray(userId) ? userId : [userId]
          })
          .subscribe(result => {
            if (result) {
              table.refresh(false);
              this.messageService.success(`${this.maRemoveText}成功`);
            } else {
              this.messageService.warning('用户信息不存在或已被删除');
            }
          });
      }
    });
  }

  private getUserColumns(): NzxColumn<UserInfo>[] {
    return [
      { nzShowCheckAll: true, nzShowCheckbox: true },
      { name: 'username', thText: '账号' },
      { name: 'name', thText: '姓名' },
      { name: 'officeName', thText: '所属部门' },
      { name: 'phone', thText: '手机号' },
      { name: 'isLogin', thText: '状态', tdTemplate: 'status', nzWidth: '60px' },
      { name: 'createDate', thText: '创建时间', nzWidth: '170px' }
    ];
  }

  private getUserSearchFields(): FormlyFieldConfig[] {
    return [
      {
        type: 'row',
        fieldGroup: [
          {
            type: 'input',
            key: 'username',
            props: {
              label: '账号'
            }
          },
          {
            type: 'input',
            key: 'name',
            props: {
              label: '姓名'
            }
          },
          {
            type: 'input',
            key: 'phone',
            props: {
              label: '手机号'
            }
          }
        ]
      }
    ];
  }
}
