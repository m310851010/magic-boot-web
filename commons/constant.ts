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
}

/**
 * 常量定义
 */
export const Constant = new ConstantClass();
