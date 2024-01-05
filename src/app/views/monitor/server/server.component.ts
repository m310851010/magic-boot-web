import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzxPipeModule } from '@xmagic/nzx-antd/pipe';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ProgressColorPipe } from './progress-color.pipe';

@Component({
  selector: 'ma-server',
  standalone: true,
  imports: [
    CommonModule,
    NzGridModule,
    NzCardModule,
    NzProgressModule,
    NzToolTipModule,
    NzDescriptionsModule,
    NzxPipeModule,
    NzIconModule,
    ProgressColorPipe
  ],
  templateUrl: './server.component.html',
  styleUrl: './server.component.less'
})
export default class ServerComponent {
  detail: ServerDetail = { cpu: {}, memory: {}, storage: {}, server: {}, jvm: {} } as ServerDetail;
  constructor(private http: HttpClient) {
    this.getDetail();
  }

  getDetail(): void {
    this.http.get<ServerDetail>('/monitor/monitor/server').subscribe(v => (this.detail = v));
  }
}

interface ServerDetail {
  cpu: CpuInfo;
  memory: MemoryInfo;
  storage: StorageInfo;
  server: ServerInfo;
  jvm: JvmInfo;
}

interface CpuInfo {
  name: string;
  physicalNum: number; // 物理CPU
  physicalCoreNum: number; // 物理核心
  logicalCoreNum: number; //逻辑核心
  sysUseRate: string;
  userUseRate: string;
  totalUseRate: number;
  waitRate: string;
  freeRate: string;
}

interface MemoryInfo {
  total: string;
  used: string;
  free: string;
  useRate: number;
}

interface StorageInfo {
  total: string;
  used: string;
  free: string;
  useRate: number;
}

interface ServerInfo {
  name: string;
  os: string;
  ip: string;
  arch: string;
}

interface JvmInfo {
  name: string;
  version: string;
  memoryTotal: string;
  memoryFree: string;
  memoryUsed: string;
  useRate: number;
  startTime: string;
  runTime: string;
  javaVersion: string;
  javaPath: string;
}
