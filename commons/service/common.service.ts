import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { NzxModalService } from '@xmagic/nzx-antd/modal';
import { NzxTableComponent } from '@xmagic/nzx-antd/table';
import { NzxUtils, TreeNode } from '@xmagic/nzx-antd/util';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(
    private http: HttpClient,
    private modalService: NzxModalService
  ) {}

  /**
   * 删除
   * @param options
   */
  handleDelete(options: { id: string; url: string; done?: () => {}; table?: NzxTableComponent }): void {
    this.modalService.confirm({
      nzContent: '是否确认删除该数据，删除后不可恢复?',
      nzOnOk: () => {
        this.http.delete(options.url, { params: { id: options.id } }).subscribe(() => {
          if (options.done) {
            options.done();
          } else if (options.table) {
            options.table.refresh(false);
          }
        });
      }
    });
  }
}

/**
 * 规范树结构
 * @param list
 * @param keyName key的属性名称
 * @param callback 回调函数
 */
export function normalTree(
  list: TreeNode[],
  keyName: string = 'id',
  callback?: (node: TreeNode, parentNode: TreeNode | undefined, level: number) => void
): NzTreeNodeOptions[] {
  callback ||= () => {};
  NzxUtils.forEachTree(list, (node, parentNode, level: number) => {
    if (node.children && !node.children.length) {
      delete node.children;
      node['isLeaf'] = true;
    }

    if (!node['title']) {
      node['title'] = node['name'];
    }

    if (!node['key']) {
      node['key'] = node[keyName];
    }

    callback!(node, parentNode, level);
  });
  return list as NzTreeNodeOptions[];
}
