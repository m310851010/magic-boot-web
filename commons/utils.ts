import { map, OperatorFunction } from 'rxjs';

import { DicItem } from '@xmagic/nzx-antd/service';
import { NzxUtils } from '@xmagic/nzx-antd/util';
import { NzTreeNodeOptions } from 'ng-zorro-antd/tree';

export function pick<T, K extends keyof T>(obj: T, ...keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    result[key] = obj[key];
  });
  return result;
}

export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const result = {} as Omit<T, K>;
  for (const key in obj) {
    if (keys.indexOf(key as unknown as K) === -1) {
      // @ts-ignore
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * 解析出文件名信息
 * @param filePath filePath 文件路径, 包含目录
 */
export function getFileInfo(filePath?: string): FileInfo | null {
  if (filePath == null) {
    return null;
  }

  let suffix = '';
  let name = filePath;
  let dir = '';

  const dirIndex = filePath.lastIndexOf('/');
  if (dirIndex >= 0) {
    dir = filePath.substring(0, dirIndex + 1);
    name = filePath.substring(dirIndex + 1);
  }

  const index = name.lastIndexOf('.');
  let ext = '';
  if (index >= 0) {
    // 后缀名 例如txt
    suffix = name.substring(index + 1);
    name = name.substring(0, index);
    ext = `.${suffix}`;
  }
  return { dir, filename: name + ext, name, suffix: suffix.toLowerCase() };
}

/**
 * blob转base64
 * @param blob
 */
export function blobToB64(blob: Blob): Promise<string | ArrayBuffer | null | undefined> {
  return new Promise<string | ArrayBuffer | null | undefined>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = e => resolve(e.target?.result);
    fileReader.readAsDataURL(blob);
    fileReader.onerror = e => reject(e);
  });
}

/**
 * 获取字典Label
 */
export function dicMapLabel<T extends DicItem>(
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

/**
 * 文件名信息
 */
export interface FileInfo {
  /**
   * 解析后的文件名称,带后缀
   */
  filename: string;
  /**
   * 文件后缀
   */
  suffix?: string;
  /**
   * 解析后的文件名称, 不带后缀
   */
  name: string;
  /**
   * 目录, 以 / 结尾
   */
  dir: string;
}
