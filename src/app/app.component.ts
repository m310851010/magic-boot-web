import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NzxModalModule, NzxModalWrapService } from '@xmagic/nzx-antd/modal';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzxModalModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'magic-boot-web';
  modalService = inject(NzxModalWrapService);

  openModal() {
    this.modalService.info({ nzContent: 'xxx' });
  }
}
