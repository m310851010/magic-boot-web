import { OptionItem } from '@xmagic/nzx-antd/checkbox';

/**
 * 常量定义
 */
class ConstantClass {
  /**
   * 缓存的前缀  存在localstorage
   * @private
   */
  private readonly prefix = '_ma_';
  /**
   * 请求header的token
   */
  AUTH_TOKEN_KEY = `${this.prefix}AUTHORIZATION`;
  /**
   * 登录后的用户信息
   */
  USER_INFO_KEY = `${this.prefix}USER_INFO_TOKEN`;

  /**
   * 用户状态
   */
  STATUS_OPTIONS: OptionItem[] = [
    { label: '正常', value: 0 },
    { label: '停用', value: 1 }
  ];
}

/**
 * 常量定义
 */
export const Constant = new ConstantClass();
