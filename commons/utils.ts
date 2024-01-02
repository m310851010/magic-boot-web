import { map, OperatorFunction } from 'rxjs';

import { DicItem } from '@xmagic/nzx-antd/service';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

/**
 * 把字典转换为Map结构
 */
export function dicMap<T extends DicItem>(): OperatorFunction<DicItem[] | null | undefined, Record<string, T>> {
  return source =>
    source.pipe(
      map(list => {
        const result: Record<string, T> = {};
        if (!list) {
          return result;
        }
        for (const it of list) {
          result[it.value] = it as T;
        }
        return result;
      })
    );
}

/**
 * 获取字典Label
 */
export function dicLabel<T extends DicItem>(
  key: string | number,
  defaultValue: string = '--'
): OperatorFunction<DicItem[], Record<string, T>> {
  return source =>
    source.pipe(
      map(list => {
        const result: Record<string, T> = {};
        for (const it of list) {
          if (it.value == key) {
            return it.label;
          }
        }
        return defaultValue == null ? '--' : defaultValue;
      })
    );
}

/**
 * 把list转成map结构
 * @param list 可迭代对象
 * @param key  属性名可以为空
 * @param callback
 */
export function listToMap<T, V>(
  list: T[] | undefined | null,
  key: keyof T | null | undefined,
  callback?: (item: T) => V
): Record<string, V> {
  const record: Record<string, V> = {};
  const fn = callback || (v => v);

  if (list && list.length) {
    for (const item of list) {
      const value = fn(item);
      if (value !== undefined) {
        record[(key ? item[key] : item) as string] = fn(item) as V;
      }
    }
  }

  return record;
}

/**
 * 规范树结构, 增加isLeaf属性
 * @param list 原始树结构
 * @param callback 回调函数
 */
export function normalTree(
  list: NewNode[],
  callback?: (node: NewNode, parentNode: NewNode | undefined, level: number) => void
): NzTreeNodeOptions[] {
  callback ||= () => {};
  NzxUtils.forEachTree(list, (node, parentNode, level: number) => {
    if (!node.children || !node.children.length) {
      node.isLeaf = true;
    }
    callback!(node, parentNode, level);
  });
  return list as NzTreeNodeOptions[];
}

export type NewNode = Partial<NzTreeNodeOptions>;
