"use strict";exports.__esModule=true;exports.hasNecessaryDependencies=hasNecessaryDependencies;var _chalk=_interopRequireDefault(require("chalk"));var _path=_interopRequireDefault(require("path"));var _fileExists=require("./file-exists");var _oxfordCommaList=require("./oxford-comma-list");var _fatalError=require("./fatal-error");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const requiredTSPackages=[{file:'typescript',pkg:'typescript'},{file:'@types/react/index.d.ts',pkg:'@types/react'},{file:'@types/node/index.d.ts',pkg:'@types/node'}];const requiredLintPackages=[{file:'eslint/lib/api.js',pkg:'eslint'},{file:'eslint-config-next',pkg:'eslint-config-next'}];async function hasNecessaryDependencies(baseDir,checkTSDeps,checkESLintDeps,eslintrcFile=null){if(!checkTSDeps&&!checkESLintDeps){return{resolved:undefined};}let resolutions=new Map();let requiredPackages=checkESLintDeps?requiredLintPackages:requiredTSPackages;const missingPackages=requiredPackages.filter(p=>{try{resolutions.set(p.pkg,require.resolve(p.file,{paths:[baseDir]}));return false;}catch(_){return true;}});if(missingPackages.length<1){return{resolved:checkESLintDeps?resolutions.get('eslint'):resolutions.get('typescript')};}const packagesHuman=(0,_oxfordCommaList.getOxfordCommaList)(missingPackages.map(p=>p.pkg));const packagesCli=missingPackages.map(p=>p.pkg).join(' ');const yarnLockFile=_path.default.join(baseDir,'yarn.lock');const isYarn=await(0,_fileExists.fileExists)(yarnLockFile).catch(()=>false);const removalMsg=checkTSDeps?_chalk.default.bold('If you are not trying to use TypeScript, please remove the '+_chalk.default.cyan('tsconfig.json')+' file from your package root (and any TypeScript files in your pages directory).'):_chalk.default.bold(`If you are not trying to use ESLint, please remove the ${eslintrcFile?_chalk.default.cyan(_path.default.basename(eslintrcFile))+' file from your application':_chalk.default.cyan('eslintConfig')+' field from your package.json file'}.`);throw new _fatalError.FatalError(_chalk.default.bold.red(`It looks like you're trying to use ${checkTSDeps?'TypeScript':'ESLint'} but do not have the required package(s) installed.`)+'\n\n'+_chalk.default.bold(`Please install ${_chalk.default.bold(packagesHuman)} by running:`)+'\n\n'+`\t${_chalk.default.bold.cyan((isYarn?'yarn add --dev':'npm install --save-dev')+' '+packagesCli)}`+'\n\n'+removalMsg+'\n');}
//# sourceMappingURL=has-necessary-dependencies.js.map