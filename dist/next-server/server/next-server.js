"use strict";exports.__esModule=true;exports.default=void 0;var _compression=_interopRequireDefault(require("next/dist/compiled/compression"));var _fs=_interopRequireDefault(require("fs"));var _chalk=_interopRequireDefault(require("next/dist/compiled/chalk"));var _httpProxy=_interopRequireDefault(require("next/dist/compiled/http-proxy"));var _path=require("path");var _querystring=require("querystring");var _url=require("url");var _loadCustomRoutes=require("../../lib/load-custom-routes");var _coalescedFunction=require("../../lib/coalesced-function");var _constants=require("../lib/constants");var _utils=require("../lib/router/utils");var envConfig=_interopRequireWildcard(require("../lib/runtime-config"));var _utils2=require("../lib/utils");var _apiUtils=require("./api-utils");var _config=_interopRequireWildcard(require("./config"));var _pathMatch=_interopRequireDefault(require("../lib/router/utils/path-match"));var _recursiveReaddirSync=require("./lib/recursive-readdir-sync");var _loadComponents=require("./load-components");var _normalizePagePath=require("./normalize-page-path");var _render=require("./render");var _require=require("./require");var _router=_interopRequireWildcard(require("./router"));var _prepareDestination=_interopRequireDefault(require("../lib/router/utils/prepare-destination"));var _sendPayload=require("./send-payload");var _serveStatic=require("./serve-static");var _incrementalCache=require("./incremental-cache");var _utils3=require("./utils");var _pathToRegexp=require("next/dist/compiled/path-to-regexp");var _env=require("@next/env");require("./node-polyfill-fetch");var _normalizeTrailingSlash=require("../../client/normalize-trailing-slash");var _getRouteFromAssetPath=_interopRequireDefault(require("../lib/router/utils/get-route-from-asset-path"));var _denormalizePagePath=require("./denormalize-page-path");var _accept=_interopRequireDefault(require("@hapi/accept"));var _normalizeLocalePath=require("../lib/i18n/normalize-locale-path");var _detectLocaleCookie=require("../lib/i18n/detect-locale-cookie");var Log=_interopRequireWildcard(require("../../build/output/log"));var _imageOptimizer=require("./image-optimizer");var _detectDomainLocale=require("../lib/i18n/detect-domain-locale");var _cookie=_interopRequireDefault(require("next/dist/compiled/cookie"));function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}const getCustomRouteMatcher=(0,_pathMatch.default)(true);class Server{constructor({dir='.',quiet=false,conf=null,dev=false,customServer=true}={}){var _this$nextConfig$expe,_this$nextConfig$expe2;this.dir=void 0;this.quiet=void 0;this.nextConfig=void 0;this.distDir=void 0;this.pagesDir=void 0;this.publicDir=void 0;this.hasStaticDir=void 0;this.serverBuildDir=void 0;this.pagesManifest=void 0;this.buildId=void 0;this.renderOpts=void 0;this.compression=void 0;this.onErrorMiddleware=void 0;this.incrementalCache=void 0;this.router=void 0;this.dynamicRoutes=void 0;this.customRoutes=void 0;this._cachedPreviewManifest=void 0;this.customErrorNo404Warn=(0,_utils2.execOnce)(()=>{console.warn(_chalk.default.bold.yellow(`Warning: `)+_chalk.default.yellow(`You have added a custom /_error page without a custom /404 page. This prevents the 404 page from being auto statically optimized.\nSee here for info: https://err.sh/next.js/custom-error-no-custom-404`));});this._validFilesystemPathSet=null;this.dir=(0,_path.resolve)(dir);this.quiet=quiet;const phase=this.currentPhase();(0,_env.loadEnvConfig)(this.dir,dev,Log);this.nextConfig=(0,_config.default)(phase,this.dir,conf);this.distDir=(0,_path.join)(this.dir,this.nextConfig.distDir);this.publicDir=(0,_path.join)(this.dir,_constants.CLIENT_PUBLIC_FILES_PATH);this.hasStaticDir=_fs.default.existsSync((0,_path.join)(this.dir,'static'));// Only serverRuntimeConfig needs the default
// publicRuntimeConfig gets it's default in client/index.js
const{serverRuntimeConfig={},publicRuntimeConfig,assetPrefix,generateEtags,compress}=this.nextConfig;this.buildId=this.readBuildId();this.renderOpts={poweredByHeader:this.nextConfig.poweredByHeader,canonicalBase:this.nextConfig.amp.canonicalBase,buildId:this.buildId,generateEtags,previewProps:this.getPreviewProps(),customServer:customServer===true?true:undefined,ampOptimizerConfig:(_this$nextConfig$expe=this.nextConfig.experimental.amp)==null?void 0:_this$nextConfig$expe.optimizer,basePath:this.nextConfig.basePath,images:JSON.stringify(this.nextConfig.images),optimizeFonts:this.nextConfig.experimental.optimizeFonts&&!dev,fontManifest:this.nextConfig.experimental.optimizeFonts&&!dev?(0,_require.requireFontManifest)(this.distDir,this._isLikeServerless):null,optimizeImages:this.nextConfig.experimental.optimizeImages,defaultLocale:(_this$nextConfig$expe2=this.nextConfig.experimental.i18n)==null?void 0:_this$nextConfig$expe2.defaultLocale};// Only the `publicRuntimeConfig` key is exposed to the client side
// It'll be rendered as part of __NEXT_DATA__ on the client side
if(Object.keys(publicRuntimeConfig).length>0){this.renderOpts.runtimeConfig=publicRuntimeConfig;}if(compress&&this.nextConfig.target==='server'){this.compression=(0,_compression.default)();}// Initialize next/config with the environment configuration
envConfig.setConfig({serverRuntimeConfig,publicRuntimeConfig});this.serverBuildDir=(0,_path.join)(this.distDir,this._isLikeServerless?_constants.SERVERLESS_DIRECTORY:_constants.SERVER_DIRECTORY);const pagesManifestPath=(0,_path.join)(this.serverBuildDir,_constants.PAGES_MANIFEST);if(!dev){this.pagesManifest=require(pagesManifestPath);}this.customRoutes=this.getCustomRoutes();this.router=new _router.default(this.generateRoutes());this.setAssetPrefix(assetPrefix);// call init-server middleware, this is also handled
// individually in serverless bundles when deployed
if(!dev&&this.nextConfig.experimental.plugins){const initServer=require((0,_path.join)(this.serverBuildDir,'init-server.js')).default;this.onErrorMiddleware=require((0,_path.join)(this.serverBuildDir,'on-error-server.js')).default;initServer();}this.incrementalCache=new _incrementalCache.IncrementalCache({dev,distDir:this.distDir,pagesDir:(0,_path.join)(this.distDir,this._isLikeServerless?_constants.SERVERLESS_DIRECTORY:_constants.SERVER_DIRECTORY,'pages'),flushToDisk:this.nextConfig.experimental.sprFlushToDisk});/**
     * This sets environment variable to be used at the time of SSR by head.tsx.
     * Using this from process.env allows targetting both serverless and SSR by calling
     * `process.env.__NEXT_OPTIMIZE_FONTS`.
     * TODO(prateekbh@): Remove this when experimental.optimizeFonts are being clened up.
     */if(this.renderOpts.optimizeFonts){process.env.__NEXT_OPTIMIZE_FONTS=JSON.stringify(true);}if(this.renderOpts.optimizeImages){process.env.__NEXT_OPTIMIZE_IMAGES=JSON.stringify(true);}}currentPhase(){return _constants.PHASE_PRODUCTION_SERVER;}logError(err){if(this.onErrorMiddleware){this.onErrorMiddleware({err});}if(this.quiet)return;console.error(err);}async handleRequest(req,res,parsedUrl){var _req$url,_parsedUrl$pathname;(0,_apiUtils.setLazyProp)({req:req},'cookies',(0,_apiUtils.getCookieParser)(req));// Parse url if parsedUrl not provided
if(!parsedUrl||typeof parsedUrl!=='object'){const url=req.url;parsedUrl=(0,_url.parse)(url,true);}// Parse the querystring ourselves if the user doesn't handle querystring parsing
if(typeof parsedUrl.query==='string'){parsedUrl.query=(0,_querystring.parse)(parsedUrl.query);}const{basePath}=this.nextConfig;const{i18n}=this.nextConfig.experimental;if(basePath&&((_req$url=req.url)==null?void 0:_req$url.startsWith(basePath))){// store original URL to allow checking if basePath was
// provided or not
;req._nextHadBasePath=true;req.url=req.url.replace(basePath,'')||'/';}if(i18n&&!((_parsedUrl$pathname=parsedUrl.pathname)==null?void 0:_parsedUrl$pathname.startsWith('/_next'))){// get pathname from URL with basePath stripped for locale detection
const{pathname,...parsed}=(0,_url.parse)(req.url||'/');let defaultLocale=i18n.defaultLocale;let detectedLocale=(0,_detectLocaleCookie.detectLocaleCookie)(req,i18n.locales);let acceptPreferredLocale=_accept.default.language(req.headers['accept-language'],i18n.locales);const{host}=(req==null?void 0:req.headers)||{};// remove port from host and remove port if present
const hostname=host==null?void 0:host.split(':')[0].toLowerCase();const detectedDomain=(0,_detectDomainLocale.detectDomainLocale)(i18n.domains,hostname);if(detectedDomain){defaultLocale=detectedDomain.defaultLocale;detectedLocale=defaultLocale;}// if not domain specific locale use accept-language preferred
detectedLocale=detectedLocale||acceptPreferredLocale;let localeDomainRedirect;const localePathResult=(0,_normalizeLocalePath.normalizeLocalePath)(pathname,i18n.locales);if(localePathResult.detectedLocale){detectedLocale=localePathResult.detectedLocale;req.url=(0,_url.format)({...parsed,pathname:localePathResult.pathname});req.__nextStrippedLocale=true;parsedUrl.pathname=localePathResult.pathname;// check if the locale prefix matches a domain's defaultLocale
// and we're on a locale specific domain if so redirect to that domain
// if (detectedDomain) {
//   const matchedDomain = detectDomainLocale(
//     i18n.domains,
//     undefined,
//     detectedLocale
//   )
//   if (matchedDomain) {
//     localeDomainRedirect = `http${matchedDomain.http ? '' : 's'}://${
//       matchedDomain?.domain
//     }`
//   }
// }
}else if(detectedDomain){const matchedDomain=(0,_detectDomainLocale.detectDomainLocale)(i18n.domains,undefined,acceptPreferredLocale);if(matchedDomain&&matchedDomain.domain!==detectedDomain.domain){localeDomainRedirect=`http${matchedDomain.http?'':'s'}://${matchedDomain.domain}`;}}const denormalizedPagePath=(0,_denormalizePagePath.denormalizePagePath)(pathname||'/');const detectedDefaultLocale=!detectedLocale||detectedLocale.toLowerCase()===defaultLocale.toLowerCase();const shouldStripDefaultLocale=false;// detectedDefaultLocale &&
// denormalizedPagePath.toLowerCase() ===
//   `/${i18n.defaultLocale.toLowerCase()}`
const shouldAddLocalePrefix=!detectedDefaultLocale&&denormalizedPagePath==='/';detectedLocale=detectedLocale||i18n.defaultLocale;if(i18n.localeDetection!==false&&(localeDomainRedirect||shouldAddLocalePrefix||shouldStripDefaultLocale)){// set the NEXT_LOCALE cookie when a user visits the default locale
// with the locale prefix so that they aren't redirected back to
// their accept-language preferred locale
if(shouldStripDefaultLocale&&acceptPreferredLocale!==defaultLocale){const previous=res.getHeader('set-cookie');res.setHeader('set-cookie',[...(typeof previous==='string'?[previous]:Array.isArray(previous)?previous:[]),_cookie.default.serialize('NEXT_LOCALE',defaultLocale,{httpOnly:true,path:'/'})]);}res.setHeader('Location',(0,_url.format)({// make sure to include any query values when redirecting
...parsed,pathname:localeDomainRedirect?localeDomainRedirect:shouldStripDefaultLocale?'/':`/${detectedLocale}`}));res.statusCode=307;res.end();return;}parsedUrl.query.__nextLocale=detectedLocale||defaultLocale;}res.statusCode=200;try{return await this.run(req,res,parsedUrl);}catch(err){this.logError(err);res.statusCode=500;res.end('Internal Server Error');}}getRequestHandler(){return this.handleRequest.bind(this);}setAssetPrefix(prefix){this.renderOpts.assetPrefix=prefix?prefix.replace(/\/$/,''):'';}// Backwards compatibility
async prepare(){}// Backwards compatibility
async close(){}setImmutableAssetCacheControl(res){res.setHeader('Cache-Control','public, max-age=31536000, immutable');}getCustomRoutes(){return require((0,_path.join)(this.distDir,_constants.ROUTES_MANIFEST));}getPrerenderManifest(){if(this._cachedPreviewManifest){return this._cachedPreviewManifest;}const manifest=require((0,_path.join)(this.distDir,_constants.PRERENDER_MANIFEST));return this._cachedPreviewManifest=manifest;}getPreviewProps(){return this.getPrerenderManifest().preview;}generateRoutes(){const server=this;const publicRoutes=_fs.default.existsSync(this.publicDir)?this.generatePublicRoutes():[];const staticFilesRoute=this.hasStaticDir?[{// It's very important to keep this route's param optional.
// (but it should support as many params as needed, separated by '/')
// Otherwise this will lead to a pretty simple DOS attack.
// See more: https://github.com/vercel/next.js/issues/2617
match:(0,_router.route)('/static/:path*'),name:'static catchall',fn:async(req,res,params,parsedUrl)=>{const p=(0,_path.join)(this.dir,'static',...params.path);await this.serveStatic(req,res,p,parsedUrl);return{finished:true};}}]:[];const fsRoutes=[{match:(0,_router.route)('/_next/static/:path*'),type:'route',name:'_next/static catchall',fn:async(req,res,params,parsedUrl)=>{// make sure to 404 for /_next/static itself
if(!params.path){await this.render404(req,res,parsedUrl);return{finished:true};}if(params.path[0]===_constants.CLIENT_STATIC_FILES_RUNTIME||params.path[0]==='chunks'||params.path[0]==='css'||params.path[0]==='media'||params.path[0]===this.buildId||params.path[0]==='pages'||params.path[1]==='pages'){this.setImmutableAssetCacheControl(res);}const p=(0,_path.join)(this.distDir,_constants.CLIENT_STATIC_FILES_PATH,...(params.path||[]));await this.serveStatic(req,res,p,parsedUrl);return{finished:true};}},{match:(0,_router.route)('/_next/data/:path*'),type:'route',name:'_next/data catchall',fn:async(req,res,params,_parsedUrl)=>{// Make sure to 404 for /_next/data/ itself and
// we also want to 404 if the buildId isn't correct
if(!params.path||params.path[0]!==this.buildId){await this.render404(req,res,_parsedUrl);return{finished:true};}// remove buildId from URL
params.path.shift();// show 404 if it doesn't end with .json
if(!params.path[params.path.length-1].endsWith('.json')){await this.render404(req,res,_parsedUrl);return{finished:true};}// re-create page's pathname
let pathname=`/${params.path.join('/')}`;const{i18n}=this.nextConfig.experimental;if(i18n){const{host}=(req==null?void 0:req.headers)||{};// remove port from host and remove port if present
const hostname=host==null?void 0:host.split(':')[0].toLowerCase();const localePathResult=(0,_normalizeLocalePath.normalizeLocalePath)(pathname,i18n.locales);const{defaultLocale}=(0,_detectDomainLocale.detectDomainLocale)(i18n.domains,hostname)||{};let detectedLocale=defaultLocale;if(localePathResult.detectedLocale){pathname=localePathResult.pathname;detectedLocale=localePathResult.detectedLocale;}_parsedUrl.query.__nextLocale=detectedLocale;}pathname=(0,_getRouteFromAssetPath.default)(pathname,'.json');const parsedUrl=(0,_url.parse)(pathname,true);await this.render(req,res,pathname,{..._parsedUrl.query,_nextDataReq:'1'},parsedUrl);return{finished:true};}},{match:(0,_router.route)('/_next/image'),type:'route',name:'_next/image catchall',fn:(req,res,_params,parsedUrl)=>(0,_imageOptimizer.imageOptimizer)(server,req,res,parsedUrl)},{match:(0,_router.route)('/_next/:path*'),type:'route',name:'_next catchall',// This path is needed because `render()` does a check for `/_next` and the calls the routing again
fn:async(req,res,_params,parsedUrl)=>{await this.render404(req,res,parsedUrl);return{finished:true};}},...publicRoutes,...staticFilesRoute];const getCustomRouteBasePath=r=>{return r.basePath!==false&&this.renderOpts.dev?this.nextConfig.basePath:'';};const getCustomRoute=(r,type)=>({...r,type,match:getCustomRouteMatcher(`${getCustomRouteBasePath(r)}${r.source}`),name:type,fn:async(_req,_res,_params,_parsedUrl)=>({finished:false})});const updateHeaderValue=(value,params)=>{if(!value.includes(':')){return value;}for(const key of Object.keys(params)){if(value.includes(`:${key}`)){value=value.replace(new RegExp(`:${key}\\*`,'g'),`:${key}--ESCAPED_PARAM_ASTERISKS`).replace(new RegExp(`:${key}\\?`,'g'),`:${key}--ESCAPED_PARAM_QUESTION`).replace(new RegExp(`:${key}\\+`,'g'),`:${key}--ESCAPED_PARAM_PLUS`).replace(new RegExp(`:${key}(?!\\w)`,'g'),`--ESCAPED_PARAM_COLON${key}`);}}value=value.replace(/(:|\*|\?|\+|\(|\)|\{|\})/g,'\\$1').replace(/--ESCAPED_PARAM_PLUS/g,'+').replace(/--ESCAPED_PARAM_COLON/g,':').replace(/--ESCAPED_PARAM_QUESTION/g,'?').replace(/--ESCAPED_PARAM_ASTERISKS/g,'*');// the value needs to start with a forward-slash to be compiled
// correctly
return(0,_pathToRegexp.compile)(`/${value}`,{validate:false})(params).substr(1);};// Headers come very first
const headers=this.customRoutes.headers.map(r=>{const headerRoute=getCustomRoute(r,'header');return{match:headerRoute.match,type:headerRoute.type,name:`${headerRoute.type} ${headerRoute.source} header route`,fn:async(_req,res,params,_parsedUrl)=>{const hasParams=Object.keys(params).length>0;for(const header of headerRoute.headers){let{key,value}=header;if(hasParams){key=updateHeaderValue(key,params);value=updateHeaderValue(value,params);}res.setHeader(key,value);}return{finished:false};}};});const redirects=this.customRoutes.redirects.map(redirect=>{const redirectRoute=getCustomRoute(redirect,'redirect');return{type:redirectRoute.type,match:redirectRoute.match,statusCode:redirectRoute.statusCode,name:`Redirect route`,fn:async(_req,res,params,parsedUrl)=>{const{parsedDestination}=(0,_prepareDestination.default)(redirectRoute.destination,params,parsedUrl.query,false,getCustomRouteBasePath(redirectRoute));const{query}=parsedDestination;delete parsedDestination.query;parsedDestination.search=(0,_querystring.stringify)(query,undefined,undefined,{encodeURIComponent:str=>str});const updatedDestination=(0,_url.format)(parsedDestination);res.setHeader('Location',updatedDestination);res.statusCode=(0,_loadCustomRoutes.getRedirectStatus)(redirectRoute);// Since IE11 doesn't support the 308 header add backwards
// compatibility using refresh header
if(res.statusCode===308){res.setHeader('Refresh',`0;url=${updatedDestination}`);}res.end();return{finished:true};}};});const rewrites=this.customRoutes.rewrites.map(rewrite=>{const rewriteRoute=getCustomRoute(rewrite,'rewrite');return{...rewriteRoute,check:true,type:rewriteRoute.type,name:`Rewrite route`,match:rewriteRoute.match,fn:async(req,res,params,parsedUrl)=>{const{newUrl,parsedDestination}=(0,_prepareDestination.default)(rewriteRoute.destination,params,parsedUrl.query,true,getCustomRouteBasePath(rewriteRoute));// external rewrite, proxy it
if(parsedDestination.protocol){const{query}=parsedDestination;delete parsedDestination.query;parsedDestination.search=(0,_querystring.stringify)(query,undefined,undefined,{encodeURIComponent:str=>str});const target=(0,_url.format)(parsedDestination);const proxy=new _httpProxy.default({target,changeOrigin:true,ignorePath:true});proxy.web(req,res);proxy.on('error',err=>{console.error(`Error occurred proxying ${target}`,err);});return{finished:true};};req._nextRewroteUrl=newUrl;req._nextDidRewrite=req._nextRewroteUrl!==req.url;return{finished:false,pathname:newUrl,query:parsedDestination.query};}};});const catchAllRoute={match:(0,_router.route)('/:path*'),type:'route',name:'Catchall render',fn:async(req,res,params,parsedUrl)=>{var _params$path;let{pathname,query}=parsedUrl;if(!pathname){throw new Error('pathname is undefined');}// next.js core assumes page path without trailing slash
pathname=(0,_normalizeTrailingSlash.removePathTrailingSlash)(pathname);if((params==null?void 0:(_params$path=params.path)==null?void 0:_params$path[0])==='api'){const handled=await this.handleApiRequest(req,res,pathname,query);if(handled){return{finished:true};}}await this.render(req,res,pathname,query,parsedUrl);return{finished:true};}};const{useFileSystemPublicRoutes}=this.nextConfig;if(useFileSystemPublicRoutes){this.dynamicRoutes=this.getDynamicRoutes();}return{headers,fsRoutes,rewrites,redirects,catchAllRoute,useFileSystemPublicRoutes,dynamicRoutes:this.dynamicRoutes,basePath:this.nextConfig.basePath,pageChecker:this.hasPage.bind(this)};}async getPagePath(pathname){return(0,_require.getPagePath)(pathname,this.distDir,this._isLikeServerless,this.renderOpts.dev);}async hasPage(pathname){let found=false;try{found=!!(await this.getPagePath(pathname));}catch(_){}return found;}async _beforeCatchAllRender(_req,_res,_params,_parsedUrl){return false;}// Used to build API page in development
async ensureApiPage(_pathname){}/**
   * Resolves `API` request, in development builds on demand
   * @param req http request
   * @param res http response
   * @param pathname path of request
   */async handleApiRequest(req,res,pathname,query){let page=pathname;let params=false;let pageFound=await this.hasPage(page);if(!pageFound&&this.dynamicRoutes){for(const dynamicRoute of this.dynamicRoutes){params=dynamicRoute.match(pathname);if(dynamicRoute.page.startsWith('/api')&&params){page=dynamicRoute.page;pageFound=true;break;}}}if(!pageFound){return false;}// Make sure the page is built before getting the path
// or else it won't be in the manifest yet
await this.ensureApiPage(page);let builtPagePath;try{builtPagePath=await this.getPagePath(page);}catch(err){if(err.code==='ENOENT'){return false;}throw err;}const pageModule=await require(builtPagePath);query={...query,...params};if(!this.renderOpts.dev&&this._isLikeServerless){if(typeof pageModule.default==='function'){prepareServerlessUrl(req,query);await pageModule.default(req,res);return true;}}await(0,_apiUtils.apiResolver)(req,res,query,pageModule,this.renderOpts.previewProps,false,this.onErrorMiddleware);return true;}generatePublicRoutes(){const publicFiles=new Set((0,_recursiveReaddirSync.recursiveReadDirSync)(this.publicDir).map(p=>encodeURI(p.replace(/\\/g,'/'))));return[{match:(0,_router.route)('/:path*'),name:'public folder catchall',fn:async(req,res,params,parsedUrl)=>{const pathParts=params.path||[];const{basePath}=this.nextConfig;// if basePath is defined require it be present
if(basePath){if(pathParts[0]!==basePath.substr(1))return{finished:false};pathParts.shift();}const path=`/${pathParts.join('/')}`;if(publicFiles.has(path)){await this.serveStatic(req,res,(0,_path.join)(this.publicDir,...pathParts),parsedUrl);return{finished:true};}return{finished:false};}}];}getDynamicRoutes(){return(0,_utils.getSortedRoutes)(Object.keys(this.pagesManifest)).filter(_utils.isDynamicRoute).map(page=>({page,match:(0,_utils.getRouteMatcher)((0,_utils.getRouteRegex)(page))}));}handleCompression(req,res){if(this.compression){this.compression(req,res,()=>{});}}async run(req,res,parsedUrl){this.handleCompression(req,res);try{const matched=await this.router.execute(req,res,parsedUrl);if(matched){return;}}catch(err){if(err.code==='DECODE_FAILED'){res.statusCode=400;return this.renderError(null,req,res,'/_error',{});}throw err;}await this.render404(req,res,parsedUrl);}async sendHTML(req,res,html){const{generateEtags,poweredByHeader}=this.renderOpts;return(0,_sendPayload.sendPayload)(req,res,html,'html',{generateEtags,poweredByHeader});}async render(req,res,pathname,query={},parsedUrl){if(!pathname.startsWith('/')){console.warn(`Cannot render page with path "${pathname}", did you mean "/${pathname}"?. See more info here: https://err.sh/next.js/render-no-starting-slash`);}if(this.renderOpts.customServer&&pathname==='/index'&&!(await this.hasPage('/index'))){// maintain backwards compatibility for custom server
// (see custom-server integration tests)
pathname='/';}const url=req.url;// we allow custom servers to call render for all URLs
// so check if we need to serve a static _next file or not.
// we don't modify the URL for _next/data request but still
// call render so we special case this to prevent an infinite loop
if(!query._nextDataReq&&(url.match(/^\/_next\//)||this.hasStaticDir&&url.match(/^\/static\//))){return this.handleRequest(req,res,parsedUrl);}if((0,_utils3.isBlockedPage)(pathname)){return this.render404(req,res,parsedUrl);}const html=await this.renderToHTML(req,res,pathname,query);// Request was ended by the user
if(html===null){return;}return this.sendHTML(req,res,html);}async findPageComponents(pathname,query={},params=null){let paths=[// try serving a static AMP version first
query.amp?(0,_normalizePagePath.normalizePagePath)(pathname)+'.amp':null,pathname].filter(Boolean);if(query.__nextLocale){paths=[...paths.map(path=>`/${query.__nextLocale}${path==='/'?'':path}`),...paths];}for(const pagePath of paths){try{const components=await(0,_loadComponents.loadComponents)(this.distDir,pagePath,!this.renderOpts.dev&&this._isLikeServerless);// if loading an static HTML file the locale is required
// to be present since all HTML files are output under their locale
if(query.__nextLocale&&typeof components.Component==='string'&&!(pagePath==null?void 0:pagePath.startsWith(`/${query.__nextLocale}`))){const err=new Error('NOT_FOUND');err.code='ENOENT';throw err;}return{components,query:{...(components.getStaticProps?{amp:query.amp,_nextDataReq:query._nextDataReq,__nextLocale:query.__nextLocale}:query),...(params||{})}};}catch(err){if(err.code!=='ENOENT')throw err;}}return null;}async getStaticPaths(pathname){// `staticPaths` is intentionally set to `undefined` as it should've
// been caught when checking disk data.
const staticPaths=undefined;// Read whether or not fallback should exist from the manifest.
const fallbackField=this.getPrerenderManifest().dynamicRoutes[pathname].fallback;return{staticPaths,fallbackMode:typeof fallbackField==='string'?'static':fallbackField===null?'blocking':false};}async renderToHTMLWithComponents(req,res,pathname,{components,query},opts){// we need to ensure the status code if /404 is visited directly
if(pathname==='/404'){res.statusCode=404;}// handle static page
if(typeof components.Component==='string'){return components.Component;}// check request state
const isLikeServerless=typeof components.Component==='object'&&typeof components.Component.renderReqToHTML==='function';const isSSG=!!components.getStaticProps;const isServerProps=!!components.getServerSideProps;const hasStaticPaths=!!components.getStaticPaths;if(!query.amp){delete query.amp;}// Toggle whether or not this is a Data request
const isDataReq=!!query._nextDataReq&&(isSSG||isServerProps);delete query._nextDataReq;const locale=query.__nextLocale;delete query.__nextLocale;const{i18n}=this.nextConfig.experimental;const locales=i18n.locales;let previewData;let isPreviewMode=false;if(isServerProps||isSSG){previewData=(0,_apiUtils.tryGetPreviewData)(req,res,this.renderOpts.previewProps);isPreviewMode=previewData!==false;}// Compute the iSSG cache key. We use the rewroteUrl since
// pages with fallback: false are allowed to be rewritten to
// and we need to look up the path by the rewritten path
let urlPathname=(0,_url.parse)(req.url||'').pathname||'/';let resolvedUrlPathname=req._nextRewroteUrl?req._nextRewroteUrl:urlPathname;resolvedUrlPathname=(0,_normalizeTrailingSlash.removePathTrailingSlash)(resolvedUrlPathname);urlPathname=(0,_normalizeTrailingSlash.removePathTrailingSlash)(urlPathname);const stripNextDataPath=path=>{if(path.includes(this.buildId)){path=(0,_denormalizePagePath.denormalizePagePath)((path.split(this.buildId).pop()||'/').replace(/\.json$/,''));}if(this.nextConfig.experimental.i18n){return(0,_normalizeLocalePath.normalizeLocalePath)(path,locales).pathname;}return path;};// remove /_next/data prefix from urlPathname so it matches
// for direct page visit and /_next/data visit
if(isDataReq){resolvedUrlPathname=stripNextDataPath(resolvedUrlPathname);urlPathname=stripNextDataPath(urlPathname);}const ssgCacheKey=isPreviewMode||!isSSG?undefined// Preview mode bypasses the cache
:`${locale?`/${locale}`:''}${resolvedUrlPathname}${query.amp?'.amp':''}`;// Complete the response with cached data if its present
const cachedData=ssgCacheKey?await this.incrementalCache.get(ssgCacheKey):undefined;if(cachedData){if(cachedData.isNotFound){// we don't currently revalidate when notFound is returned
// so trigger rendering 404 here
throw new NoFallbackError();}const data=isDataReq?JSON.stringify(cachedData.pageData):cachedData.html;(0,_sendPayload.sendPayload)(req,res,data,isDataReq?'json':'html',{generateEtags:this.renderOpts.generateEtags,poweredByHeader:this.renderOpts.poweredByHeader},!this.renderOpts.dev?{private:isPreviewMode,stateful:false,// GSP response
revalidate:cachedData.curRevalidate!==undefined?cachedData.curRevalidate:/* default to minimum revalidate (this should be an invariant) */1}:undefined);// Stop the request chain here if the data we sent was up-to-date
if(!cachedData.isStale){return null;}}// If we're here, that means data is missing or it's stale.
const maybeCoalesceInvoke=ssgCacheKey?fn=>(0,_coalescedFunction.withCoalescedInvoke)(fn).bind(null,ssgCacheKey,[]):fn=>async()=>{const value=await fn();return{isOrigin:true,value};};const doRender=maybeCoalesceInvoke(async()=>{let pageData;let html;let sprRevalidate;let isNotFound;let renderResult;// handle serverless
if(isLikeServerless){renderResult=await components.Component.renderReqToHTML(req,res,'passthrough',{fontManifest:this.renderOpts.fontManifest,locale,locales// defaultLocale,
});html=renderResult.html;pageData=renderResult.renderOpts.pageData;sprRevalidate=renderResult.renderOpts.revalidate;isNotFound=renderResult.renderOpts.ssgNotFound;}else{const origQuery=(0,_url.parse)(req.url||'',true).query;const resolvedUrl=(0,_url.format)({pathname:resolvedUrlPathname,// make sure to only add query values from original URL
query:origQuery});const renderOpts={...components,...opts,isDataReq,resolvedUrl,locale,locales,// defaultLocale,
// For getServerSideProps we need to ensure we use the original URL
// and not the resolved URL to prevent a hydration mismatch on
// asPath
resolvedAsPath:isServerProps?(0,_url.format)({// we use the original URL pathname less the _next/data prefix if
// present
pathname:urlPathname,query:origQuery}):resolvedUrl};renderResult=await(0,_render.renderToHTML)(req,res,pathname,query,renderOpts);html=renderResult;// TODO: change this to a different passing mechanism
pageData=renderOpts.pageData;sprRevalidate=renderOpts.revalidate;isNotFound=renderOpts.ssgNotFound;}return{html,pageData,sprRevalidate,isNotFound};});const isProduction=!this.renderOpts.dev;const isDynamicPathname=(0,_utils.isDynamicRoute)(pathname);const didRespond=(0,_utils2.isResSent)(res);const{staticPaths,fallbackMode}=hasStaticPaths?await this.getStaticPaths(pathname):{staticPaths:undefined,fallbackMode:false};// When we did not respond from cache, we need to choose to block on
// rendering or return a skeleton.
//
// * Data requests always block.
//
// * Blocking mode fallback always blocks.
//
// * Preview mode toggles all pages to be resolved in a blocking manner.
//
// * Non-dynamic pages should block (though this is an impossible
//   case in production).
//
// * Dynamic pages should return their skeleton if not defined in
//   getStaticPaths, then finish the data request on the client-side.
//
if(fallbackMode!=='blocking'&&ssgCacheKey&&!didRespond&&!isPreviewMode&&isDynamicPathname&&(// Development should trigger fallback when the path is not in
// `getStaticPaths`
isProduction||!staticPaths||// static paths always includes locale so make sure it's prefixed
// with it
!staticPaths.includes(`${locale?'/'+locale:''}${resolvedUrlPathname}`))){if(// In development, fall through to render to handle missing
// getStaticPaths.
(isProduction||staticPaths)&&// When fallback isn't present, abort this render so we 404
fallbackMode!=='static'){throw new NoFallbackError();}if(!isDataReq){let html;// Production already emitted the fallback as static HTML.
if(isProduction){html=await this.incrementalCache.getFallback(locale?`/${locale}${pathname}`:pathname);}// We need to generate the fallback on-demand for development.
else{query.__nextFallback='true';if(isLikeServerless){prepareServerlessUrl(req,query);}const{value:renderResult}=await doRender();html=renderResult.html;}(0,_sendPayload.sendPayload)(req,res,html,'html',{generateEtags:this.renderOpts.generateEtags,poweredByHeader:this.renderOpts.poweredByHeader});return null;}}const{isOrigin,value:{html,pageData,sprRevalidate,isNotFound}}=await doRender();let resHtml=html;if(!(0,_utils2.isResSent)(res)&&!isNotFound&&(isSSG||isDataReq||isServerProps)){(0,_sendPayload.sendPayload)(req,res,isDataReq?JSON.stringify(pageData):html,isDataReq?'json':'html',{generateEtags:this.renderOpts.generateEtags,poweredByHeader:this.renderOpts.poweredByHeader},!this.renderOpts.dev||isServerProps&&!isDataReq?{private:isPreviewMode,stateful:!isSSG,revalidate:sprRevalidate}:undefined);resHtml=null;}// Update the cache if the head request and cacheable
if(isOrigin&&ssgCacheKey){await this.incrementalCache.set(ssgCacheKey,{html:html,pageData,isNotFound},sprRevalidate);}if(isNotFound){throw new NoFallbackError();}return resHtml;}async renderToHTML(req,res,pathname,query={}){try{const result=await this.findPageComponents(pathname,query);if(result){try{return await this.renderToHTMLWithComponents(req,res,pathname,result,{...this.renderOpts});}catch(err){if(!(err instanceof NoFallbackError)){throw err;}}}if(this.dynamicRoutes){for(const dynamicRoute of this.dynamicRoutes){const params=dynamicRoute.match(pathname);if(!params){continue;}const dynamicRouteResult=await this.findPageComponents(dynamicRoute.page,query,params);if(dynamicRouteResult){try{return await this.renderToHTMLWithComponents(req,res,dynamicRoute.page,dynamicRouteResult,{...this.renderOpts,params});}catch(err){if(!(err instanceof NoFallbackError)){throw err;}}}}}}catch(err){this.logError(err);if(err&&err.code==='DECODE_FAILED'){res.statusCode=400;return await this.renderErrorToHTML(err,req,res,pathname,query);}res.statusCode=500;return await this.renderErrorToHTML(err,req,res,pathname,query);}res.statusCode=404;return await this.renderErrorToHTML(null,req,res,pathname,query);}async renderError(err,req,res,pathname,query={}){res.setHeader('Cache-Control','no-cache, no-store, max-age=0, must-revalidate');const html=await this.renderErrorToHTML(err,req,res,pathname,query);if(html===null){return;}return this.sendHTML(req,res,html);}async renderErrorToHTML(err,req,res,_pathname,query={}){let result=null;const is404=res.statusCode===404;let using404Page=false;// use static 404 page if available and is 404 response
if(is404){result=await this.findPageComponents('/404',query);using404Page=result!==null;}if(!result){result=await this.findPageComponents('/_error',query);}if(process.env.NODE_ENV!=='production'&&!using404Page&&(await this.hasPage('/_error'))&&!(await this.hasPage('/404'))){this.customErrorNo404Warn();}let html;try{try{html=await this.renderToHTMLWithComponents(req,res,using404Page?'/404':'/_error',result,{...this.renderOpts,err});}catch(maybeFallbackError){if(maybeFallbackError instanceof NoFallbackError){throw new Error('invariant: failed to render error page');}throw maybeFallbackError;}}catch(renderToHtmlError){console.error(renderToHtmlError);res.statusCode=500;html='Internal Server Error';}return html;}async render404(req,res,parsedUrl){const url=req.url;const{pathname,query}=parsedUrl?parsedUrl:(0,_url.parse)(url,true);res.statusCode=404;return this.renderError(null,req,res,pathname,query);}async serveStatic(req,res,path,parsedUrl){if(!this.isServeableUrl(path)){return this.render404(req,res,parsedUrl);}if(!(req.method==='GET'||req.method==='HEAD')){res.statusCode=405;res.setHeader('Allow',['GET','HEAD']);return this.renderError(null,req,res,path);}try{await(0,_serveStatic.serveStatic)(req,res,path);}catch(err){if(err.code==='ENOENT'||err.statusCode===404){this.render404(req,res,parsedUrl);}else if(err.statusCode===412){res.statusCode=412;return this.renderError(err,req,res,path);}else{throw err;}}}getFilesystemPaths(){if(this._validFilesystemPathSet){return this._validFilesystemPathSet;}const pathUserFilesStatic=(0,_path.join)(this.dir,'static');let userFilesStatic=[];if(this.hasStaticDir&&_fs.default.existsSync(pathUserFilesStatic)){userFilesStatic=(0,_recursiveReaddirSync.recursiveReadDirSync)(pathUserFilesStatic).map(f=>(0,_path.join)('.','static',f));}let userFilesPublic=[];if(this.publicDir&&_fs.default.existsSync(this.publicDir)){userFilesPublic=(0,_recursiveReaddirSync.recursiveReadDirSync)(this.publicDir).map(f=>(0,_path.join)('.','public',f));}let nextFilesStatic=[];nextFilesStatic=(0,_recursiveReaddirSync.recursiveReadDirSync)((0,_path.join)(this.distDir,'static')).map(f=>(0,_path.join)('.',(0,_path.relative)(this.dir,this.distDir),'static',f));return this._validFilesystemPathSet=new Set([...nextFilesStatic,...userFilesPublic,...userFilesStatic]);}isServeableUrl(untrustedFileUrl){// This method mimics what the version of `send` we use does:
// 1. decodeURIComponent:
//    https://github.com/pillarjs/send/blob/0.17.1/index.js#L989
//    https://github.com/pillarjs/send/blob/0.17.1/index.js#L518-L522
// 2. resolve:
//    https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L561
let decodedUntrustedFilePath;try{// (1) Decode the URL so we have the proper file name
decodedUntrustedFilePath=decodeURIComponent(untrustedFileUrl);}catch(_unused){return false;}// (2) Resolve "up paths" to determine real request
const untrustedFilePath=(0,_path.resolve)(decodedUntrustedFilePath);// don't allow null bytes anywhere in the file path
if(untrustedFilePath.indexOf('\0')!==-1){return false;}// Check if .next/static, static and public are in the path.
// If not the path is not available.
if((untrustedFilePath.startsWith((0,_path.join)(this.distDir,'static')+_path.sep)||untrustedFilePath.startsWith((0,_path.join)(this.dir,'static')+_path.sep)||untrustedFilePath.startsWith((0,_path.join)(this.dir,'public')+_path.sep))===false){return false;}// Check against the real filesystem paths
const filesystemUrls=this.getFilesystemPaths();const resolved=(0,_path.relative)(this.dir,untrustedFilePath);return filesystemUrls.has(resolved);}readBuildId(){const buildIdFile=(0,_path.join)(this.distDir,_constants.BUILD_ID_FILE);try{return _fs.default.readFileSync(buildIdFile,'utf8').trim();}catch(err){if(!_fs.default.existsSync(buildIdFile)){throw new Error(`Could not find a valid build in the '${this.distDir}' directory! Try building your app with 'next build' before starting the server.`);}throw err;}}get _isLikeServerless(){return(0,_config.isTargetLikeServerless)(this.nextConfig.target);}}exports.default=Server;function prepareServerlessUrl(req,query){const curUrl=(0,_url.parse)(req.url,true);req.url=(0,_url.format)({...curUrl,search:undefined,query:{...curUrl.query,...query}});}class NoFallbackError extends Error{}
//# sourceMappingURL=next-server.js.map