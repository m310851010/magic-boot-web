import { map, OperatorFunction } from 'rxjs';

import { DicItem } from '@xmagic/nzx-antd/service';

/**
 * 把字典转换为Map结构
 */
export function dicMap<T extends DicItem>(): OperatorFunction<DicItem[], Record<string, T>> {
  return source =>
    source.pipe(
      map(list => {
        const result: Record<string, T> = {};
        for (const it of list) {
          result[it.value] = it as T;
        }
        return result;
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
  list: T[],
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
