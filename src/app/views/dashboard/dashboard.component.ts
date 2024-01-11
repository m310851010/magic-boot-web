import { CommonModule } from '@angular/common';
import { Component, Injector, OnInit, runInInjectionContext, ViewChild, ViewContainerRef } from '@angular/core';

import { loadRemoteModule } from '@angular-architects/native-federation';

@Component({
  selector: 'ma-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.less'
})
export default class DashboardComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) containerRef!: ViewContainerRef;
  constructor() {}

  ngOnInit(): void {}

  loadComponent(): void {
    loadRemoteModule({
      remoteEntry: `${window.environment.pluginPathAi}/remoteEntry.json`,
      remoteName: 'chat-ai-plugin',
      exposedModule: './Component'
    })
      .then(m => m.AppComponent)
      .then(com => {
        this.containerRef.createComponent(com);
      });
  }
}
