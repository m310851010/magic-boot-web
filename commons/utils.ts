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
