//设置全局属性
// declare global {
interface Window {
  //window对象属性
  environment: Environment;

  [key: string]: any;
}
// }
interface Environment {
  production: boolean;
  basePath: string;
  pluginPathAi: string;
}
