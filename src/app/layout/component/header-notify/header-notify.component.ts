import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'np-header-notify',
  exportAs: 'headerNotify',
  templateUrl: './header-notify.component.html',
  styleUrls: ['./header-notify.component.less'],
  host: {
    '[class.header-action-item]': 'true'
  }
})
export class HeaderNotifyComponent implements OnInit {
  notifyMenuVisible = false;
  constructor() {}

  ngOnInit(): void {}
}
