import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { DicService } from '@xmagic/nzx-antd/service';

@Component({
  selector: 'ma-dic',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dic.component.html',
  styleUrl: './dic.component.less'
})
export default class DicComponent {
  constructor() {}
}

interface Dict {
  id: string;
  /**
   * 父节点
   */
  pid: string;
  /**
   * 名称
   */
  label: string;
  /**
   * 字典值
   */
  value: string | number;
  /**
   * 字典类型：0系统类，1业务类
   */
  dictType: 0 | 1;
  /**
   * 排序号
   */
  sort: number;
  /**
   * 数据类型,0:string 0: number
   */
  dataType: 0 | 1;
  /**
   * 删除标识：0未删除，1已删除
   */
  isDel: 0 | 1;
  /**
   * 状态 0: 正常 1: 停用
   */
  status: 0 | 1;
  /**
   * 扩展JSON数据
   */
  extJson?: string;
  /**
   * 描述
   */
  desc?: string;
}
