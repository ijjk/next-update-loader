"use strict";exports.__esModule=true;exports.getLintIntent=getLintIntent;var _fs=require("fs");var CommentJson=_interopRequireWildcard(require("next/dist/compiled/comment-json"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}async function getLintIntent(eslintrcFile,pkgJsonEslintConfig){if(eslintrcFile){const content=await _fs.promises.readFile(eslintrcFile,{encoding:'utf8'}).then(txt=>txt.trim().replace(/\n/g,''),()=>null);// User is setting up ESLint for the first time setup if eslint config exists but is empty
return{firstTimeSetup:content===''||content==='{}'||content==='---'||content==='module.exports = {}'};}else if(pkgJsonEslintConfig){return{firstTimeSetup:CommentJson.stringify(pkgJsonEslintConfig)==='{}'};}return false;}
//# sourceMappingURL=getLintIntent.js.map