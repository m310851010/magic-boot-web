/**
 * 获取最大排序号
 * @param list
 */
export function getMaxSort<T extends { sort: number }>(list: T[]): number {
  let maxSort = 0;
  if (list) {
    list.forEach(v => {
      if (v.sort > maxSort) {
        maxSort = v.sort;
      }
    });
  }
  return maxSort + 1;
}
