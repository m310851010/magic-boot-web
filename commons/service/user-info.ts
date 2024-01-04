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
  /**
   * 权限码，如果permission为空则取菜单的path与路由的path进行比较，通常不用设置，只有当路由为通配符时才需要设置permission
   */
  permission?: string;
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
  nickName: string;
  /**
   * 性别, 1-男 0-女
   */
  sex: 0 | 1;

  phone?: string;
  email?: string;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 组织机构id
   */
  officeId: string;
  officeName: string;
  /**
   * 用户状态 0正常，1禁用
   */
  status: 0 | 1;
  /**
   * 创建时间
   */
  createDate: string;
  /**
   * 角色名称
   */
  roleNames: string[];
}
