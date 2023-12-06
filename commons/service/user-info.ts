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
  pid: string;
  name: string;
  url: string;
  path: string;
  icon: string;
  component: string;
  componentName: string;
  isShow: boolean;
  alwaysShow: boolean;
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
  layout?: 'iframe' | 'route';

  selected?: boolean;
  keepAlive: boolean;
}

/**
 * 用户信息
 */
export interface UserInfo {
  id: string;
  /**
   * 用户名
   */
  username: string;
  /**
   * 权限码
   */
  authorities: string[];
  /**
   * 名称
   */
  name: string;
  /**
   * 性别, 1-男 2-女
   */
  sex: 1 | 2;
  /**
   * 用户状态 1:正常 2:禁用 3:删除 4:锁定
   */
  status: 1 | 2 | 3 | 4;
  phone: string;
  /**
   * 头像
   */
  headPortrait: string;
  /**
   * 组织机构id
   */
  officeId: string;
  /**
   * 禁止登录：0未禁用，1已禁用
   */
  isLogin: 0 | 1;
  /**
   * 密码
   */
  password?: string;
}
