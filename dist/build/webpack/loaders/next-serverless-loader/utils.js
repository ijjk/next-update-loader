"use strict";exports.__esModule=true;exports.getUtils=getUtils;exports.vercelHeader=void 0;var _url=require("url");var _normalizeLocalePath=require("../../../../next-server/lib/i18n/normalize-locale-path");var _pathMatch=_interopRequireDefault(require("../../../../next-server/lib/router/utils/path-match"));var _routeRegex=require("../../../../next-server/lib/router/utils/route-regex");var _routeMatcher=require("../../../../next-server/lib/router/utils/route-matcher");var _prepareDestination=_interopRequireDefault(require("../../../../next-server/lib/router/utils/prepare-destination"));var _accept=_interopRequireDefault(require("@hapi/accept"));var _detectLocaleCookie=require("../../../../next-server/lib/i18n/detect-locale-cookie");var _detectDomainLocale=require("../../../../next-server/lib/i18n/detect-domain-locale");var _denormalizePagePath=require("../../../../next-server/server/denormalize-page-path");var _cookie=_interopRequireDefault(require("next/dist/compiled/cookie"));var _constants=require("../../../../next-server/lib/constants");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const getCustomRouteMatcher=(0,_pathMatch.default)(true);const vercelHeader='x-vercel-id';exports.vercelHeader=vercelHeader;function getUtils({page,i18n,basePath,rewrites,pageIsDynamic}){let defaultRouteRegex;let dynamicRouteMatcher;let defaultRouteMatches;if(pageIsDynamic){defaultRouteRegex=(0,_routeRegex.getRouteRegex)(page);dynamicRouteMatcher=(0,_routeMatcher.getRouteMatcher)(defaultRouteRegex);defaultRouteMatches=dynamicRouteMatcher(page);}function handleRewrites(parsedUrl){for(const rewrite of rewrites){const matcher=getCustomRouteMatcher(rewrite.source);const params=matcher(parsedUrl.pathname);if(params){const{parsedDestination}=(0,_prepareDestination.default)(rewrite.destination,params,parsedUrl.query,true);Object.assign(parsedUrl.query,parsedDestination.query);delete parsedDestination.query;Object.assign(parsedUrl,parsedDestination);let fsPathname=parsedUrl.pathname;if(basePath){fsPathname=fsPathname.replace(new RegExp(`^${basePath}`),'')||'/';}if(i18n){const destLocalePathResult=(0,_normalizeLocalePath.normalizeLocalePath)(fsPathname,i18n.locales);fsPathname=destLocalePathResult.pathname;parsedUrl.query.nextInternalLocale=destLocalePathResult.detectedLocale||params.nextInternalLocale;}if(fsPathname===page){break;}if(pageIsDynamic&&dynamicRouteMatcher){const dynamicParams=dynamicRouteMatcher(fsPathname);if(dynamicParams){parsedUrl.query={...parsedUrl.query,...dynamicParams};break;}}}}return parsedUrl;}function handleBasePath(req,parsedUrl){// always strip the basePath if configured since it is required
req.url=req.url.replace(new RegExp(`^${basePath}`),'')||'/';parsedUrl.pathname=parsedUrl.pathname.replace(new RegExp(`^${basePath}`),'')||'/';}function normalizeDynamicRouteParams(params){let hasValidParams=true;if(!defaultRouteRegex)return{params,hasValidParams};params=Object.keys(defaultRouteRegex.groups).reduce((prev,key)=>{let value=params[key];// if the value matches the default value we can't rely
// on the parsed params, this is used to signal if we need
// to parse x-now-route-matches or not
const isDefaultValue=Array.isArray(value)?value.every((val,idx)=>val===defaultRouteMatches[key][idx]):value===defaultRouteMatches[key];if(isDefaultValue||typeof value==='undefined'){hasValidParams=false;}// non-provided optional values should be undefined so normalize
// them to undefined
if(defaultRouteRegex.groups[key].optional&&(!value||Array.isArray(value)&&value.length===1&&(// fallback optional catch-all SSG pages have
// [[...paramName]] for the root path on Vercel
value[0]==='index'||value[0]===`[[...${key}]]`))){value=undefined;delete params[key];}// query values from the proxy aren't already split into arrays
// so make sure to normalize catch-all values
if(value&&typeof value==='string'&&defaultRouteRegex.groups[key].repeat){value=value.split('/');}if(value){prev[key]=value;}return prev;},{});return{params,hasValidParams};}function handleLocale(req,res,parsedUrl,routeNoAssetPath,shouldNotRedirect){if(!i18n)return;let defaultLocale=i18n.defaultLocale;let detectedLocale=(0,_detectLocaleCookie.detectLocaleCookie)(req,i18n.locales);let acceptPreferredLocale=i18n.localeDetection!==false?_accept.default.language(req.headers['accept-language'],i18n.locales):detectedLocale;const{host}=req.headers||{};// remove port from host and remove port if present
const hostname=host&&host.split(':')[0].toLowerCase();const detectedDomain=(0,_detectDomainLocale.detectDomainLocale)(i18n.domains,hostname);if(detectedDomain){defaultLocale=detectedDomain.defaultLocale;detectedLocale=defaultLocale;}// if not domain specific locale use accept-language preferred
detectedLocale=detectedLocale||acceptPreferredLocale;let localeDomainRedirect;const localePathResult=(0,_normalizeLocalePath.normalizeLocalePath)(parsedUrl.pathname,i18n.locales);routeNoAssetPath=(0,_normalizeLocalePath.normalizeLocalePath)(routeNoAssetPath,i18n.locales).pathname;if(localePathResult.detectedLocale){detectedLocale=localePathResult.detectedLocale;req.url=(0,_url.format)({...parsedUrl,pathname:localePathResult.pathname});req.__nextStrippedLocale=true;parsedUrl.pathname=localePathResult.pathname;}// If a detected locale is a domain specific locale and we aren't already
// on that domain and path prefix redirect to it to prevent duplicate
// content from multiple domains
if(detectedDomain){const localeToCheck=localePathResult.detectedLocale?detectedLocale:acceptPreferredLocale;const matchedDomain=(0,_detectDomainLocale.detectDomainLocale)(i18n.domains,undefined,localeToCheck);if(matchedDomain&&matchedDomain.domain!==detectedDomain.domain){localeDomainRedirect=`http${matchedDomain.http?'':'s'}://${matchedDomain.domain}/${localeToCheck===matchedDomain.defaultLocale?'':localeToCheck}`;}}const denormalizedPagePath=(0,_denormalizePagePath.denormalizePagePath)(parsedUrl.pathname||'/');const detectedDefaultLocale=!detectedLocale||detectedLocale.toLowerCase()===defaultLocale.toLowerCase();const shouldStripDefaultLocale=false;// detectedDefaultLocale &&
// denormalizedPagePath.toLowerCase() === \`/\${i18n.defaultLocale.toLowerCase()}\`
const shouldAddLocalePrefix=!detectedDefaultLocale&&denormalizedPagePath==='/';detectedLocale=detectedLocale||i18n.defaultLocale;if(!shouldNotRedirect&&!req.headers[vercelHeader]&&i18n.localeDetection!==false&&(localeDomainRedirect||shouldAddLocalePrefix||shouldStripDefaultLocale)){// set the NEXT_LOCALE cookie when a user visits the default locale
// with the locale prefix so that they aren't redirected back to
// their accept-language preferred locale
if(shouldStripDefaultLocale&&acceptPreferredLocale!==defaultLocale){const previous=res.getHeader('set-cookie');res.setHeader('set-cookie',[...(typeof previous==='string'?[previous]:Array.isArray(previous)?previous:[]),_cookie.default.serialize('NEXT_LOCALE',defaultLocale,{httpOnly:true,path:'/'})]);}res.setHeader('Location',(0,_url.format)({// make sure to include any query values when redirecting
...parsedUrl,pathname:localeDomainRedirect?localeDomainRedirect:shouldStripDefaultLocale?basePath||'/':`${basePath}/${detectedLocale}`}));res.statusCode=_constants.TEMPORARY_REDIRECT_STATUS;res.end();return;}detectedLocale=localePathResult.detectedLocale||detectedDomain&&detectedDomain.defaultLocale||defaultLocale;return{defaultLocale,detectedLocale,routeNoAssetPath};}return{handleLocale,handleRewrites,handleBasePath,defaultRouteRegex,dynamicRouteMatcher,defaultRouteMatches,normalizeDynamicRouteParams};}
//# sourceMappingURL=utils.js.map