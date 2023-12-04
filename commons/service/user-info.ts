/**
 * 应用信息
 */
export interface AppInfo {
  /**
   * 系统编码
   */
  appCode: string;
  /**
   * 应用Id
   */
  appId: string;
  /**
   * 应用名称
   */
  name: string;
  /**
   * 是否显示
   */
  show?: boolean;
  /**
   * 应用图标
   */
  icon: string;
  /**
   * 应用的菜单
   */
  menus: Menu[];
  /**
   * 访问路径前缀
   */
  pathPrefix: string;
  /**
   * 上次点击的菜单
   */
  prevMenu?: Menu;
}

export interface Menu {
  id: string;
  name: string;
  url?: string;
  icon?: string;

  children?: Menu[];

  // 附加属性
  open: boolean;
  /**
   * 是否允许关闭
   */
  closeable?: boolean;
  /**
   * 布局方式, iframe 路由
   */
  layout?: 'iframe' | 'default';

  selected?: boolean;
  /**
   * 应用编码
   */
  appCode: string;
}

/**
 * 用户信息
 */
export interface UserInfo {
  /**
   * 用户名
   */
  username: string;
  /**
   * 名称
   */
  name: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 性别, 1-男 2-女
   */
  sex: 1 | 2;
  /**
   * 用户状态 1:正常 2:禁用 3:删除 4:锁定
   */
  state: 1 | 2 | 3 | 4;
  /**
   * 最后登录的IP地址
   */
  ip: string;
  /**
   * 密码
   */
  password?: string;
}
