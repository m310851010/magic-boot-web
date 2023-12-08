/**
 * 路由数据配置
 */
export interface RouteData {
  /**
   * 忽略权限拦截,默认拦截
   */
  ignore?: boolean;

  /**
   * 显示侧边栏,默认显示
   */
  leftSlider?: boolean;

  /**
   * 显示面包屑,默认显示
   */
  breadcrumb?: boolean;
}
