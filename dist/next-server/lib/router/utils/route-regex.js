"use strict";exports.__esModule=true;exports.getRouteRegex=getRouteRegex;// this isn't importing the escape-string-regex module
// to reduce bytes
function escapeRegex(str){return str.replace(/[|\\{}()[\]^$+*?.-]/g,'\\$&');}function parseParameter(param){const optional=param.startsWith('[')&&param.endsWith(']');if(optional){param=param.slice(1,-1);}const repeat=param.startsWith('...');if(repeat){param=param.slice(3);}return{key:param,repeat,optional};}function getRouteRegex(normalizedRoute){const segments=(normalizedRoute.replace(/\/$/,'')||'/').slice(1).split('/');const groups={};let groupIndex=1;const parameterizedRoute=segments.map(segment=>{if(segment.startsWith('[')&&segment.endsWith(']')){const{key,optional,repeat}=parseParameter(segment.slice(1,-1));groups[key]={pos:groupIndex++,repeat,optional};return repeat?optional?'(?:/(.+?))?':'/(.+?)':'/([^/]+?)';}else{return`/${escapeRegex(segment)}`;}}).join('');// dead code eliminate for browser since it's only needed
// while generating routes-manifest
if(typeof window==='undefined'){const routeKeys={};let namedParameterizedRoute=segments.map(segment=>{if(segment.startsWith('[')&&segment.endsWith(']')){const{key,optional,repeat}=parseParameter(segment.slice(1,-1));// replace any non-word characters since they can break
// the named regex
const cleanedKey=key.replace(/\W/g,'');routeKeys[cleanedKey]=key;return repeat?optional?`(?:/(?<${cleanedKey}>.+?))?`:`/(?<${cleanedKey}>.+?)`:`/(?<${cleanedKey}>[^/]+?)`;}else{return`/${escapeRegex(segment)}`;}}).join('');return{re:new RegExp(`^${parameterizedRoute}(?:/)?$`,'i'),groups,routeKeys,namedRegex:`^${namedParameterizedRoute}(?:/)?$`};}return{re:new RegExp(`^${parameterizedRoute}(?:/)?$`,'i'),groups};}
//# sourceMappingURL=route-regex.js.map