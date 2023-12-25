/**
 * 此文件用来抽取图标名称,然后写入到 `commons/component/icon-picker/ant-icons.ts`
 * 脚本会读取ng-zorro到图标库到outline目录和项目中到图标(目录:`src/assets/outline`),然后把所有图标名称合并
 * 在 `ant-icons.ts`文件中,脚本会自动替换  `/*<ICON>\*\/` 和/*</ICON>*\/ 之间的内容
 */
const fs = require('fs');
const path = require('path');

const antIconDir = path.join(__dirname, 'node_modules/@ant-design/icons-angular/src/inline-svg/outline');
const assetsIconDir = path.join(__dirname, 'src/assets/outline');
const antIconsFile = path.join(__dirname, 'commons/component/icon-picker/ant-icons.ts');
const svgNames = getIconNames(antIconDir).concat(getIconNames(assetsIconDir));

const text = fs.readFileSync(antIconsFile, { encoding: 'utf-8' });
const result = text.replace(
  /(\/\*<ICON>\*\/)[.\n\S\s]*(\/\*<\/ICON>\*\/)/gm,
  '$1\n' + svgNames.map(v => `'${v}'`).join(', ') + '\n$2'
);
fs.writeFileSync(antIconsFile, result, { encoding: 'utf-8' });

function getIconNames(iconDir) {
  const svgExt = '.svg';
  const files = fs.readdirSync(iconDir);
  const svgNames = [];
  files.forEach(fileName => {
    const ext = path.extname(fileName);
    if (ext && ext.toLowerCase() === svgExt) {
      const svgName = path.basename(fileName, ext);
      svgNames.push(svgName);
    }
  });
  return svgNames;
}

///*<ICON>*/
//   /*</ICON>*/
