"use strict";exports.__esModule=true;exports.renderToHTML=renderToHTML;var _react=_interopRequireDefault(require("react"));var _server=require("react-dom/server");var _log=require("../../build/output/log");var _constants=require("../../lib/constants");var _isSerializableProps=require("../../lib/is-serializable-props");var _amp=require("../lib/amp");var _ampContext=require("../lib/amp-context");var _constants2=require("../lib/constants");var _head=require("../lib/head");var _headManagerContext=require("../lib/head-manager-context");var _loadable=_interopRequireDefault(require("../lib/loadable"));var _loadableContext=require("../lib/loadable-context");var _mitt=_interopRequireDefault(require("../lib/mitt"));var _postProcess=_interopRequireDefault(require("../lib/post-process"));var _routerContext=require("../lib/router-context");var _isDynamic=require("../lib/router/utils/is-dynamic");var _utils=require("../lib/utils");var _apiUtils=require("./api-utils");var _denormalizePagePath=require("./denormalize-page-path");var _fontUtils=require("./font-utils");var _normalizePagePath=require("./normalize-page-path");var _optimizeAmp=_interopRequireDefault(require("./optimize-amp"));function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function noRouter(){const message='No router instance found. you should only use "next/router" inside the client side of your app. https://err.sh/vercel/next.js/no-router-instance';throw new Error(message);}class ServerRouter{// TODO: Remove in the next major version, as this would mean the user is adding event listeners in server-side `render` method
constructor(pathname,query,as,{isFallback},basePath){this.route=void 0;this.pathname=void 0;this.query=void 0;this.asPath=void 0;this.basePath=void 0;this.events=void 0;this.isFallback=void 0;this.route=pathname.replace(/\/$/,'')||'/';this.pathname=pathname;this.query=query;this.asPath=as;this.isFallback=isFallback;this.basePath=basePath;}push(){noRouter();}replace(){noRouter();}reload(){noRouter();}back(){noRouter();}prefetch(){noRouter();}beforePopState(){noRouter();}}ServerRouter.events=(0,_mitt.default)();function enhanceComponents(options,App,Component){// For backwards compatibility
if(typeof options==='function'){return{App,Component:options(Component)};}return{App:options.enhanceApp?options.enhanceApp(App):App,Component:options.enhanceComponent?options.enhanceComponent(Component):Component};}function renderDocument(Document,{buildManifest,docComponentsRendered,props,docProps,pathname,query,buildId,canonicalBase,assetPrefix,runtimeConfig,nextExport,autoExport,isFallback,dynamicImportsIds,dangerousAsPath,err,dev,ampPath,ampState,inAmpMode,hybridAmp,dynamicImports,headTags,gsp,gssp,customServer,gip,appGip,unstable_runtimeJS,devOnlyCacheBusterQueryString}){return'<!DOCTYPE html>'+(0,_server.renderToStaticMarkup)(/*#__PURE__*/_react.default.createElement(_ampContext.AmpStateContext.Provider,{value:ampState},Document.renderDocument(Document,{__NEXT_DATA__:{props,// The result of getInitialProps
page:pathname,// The rendered page
query,// querystring parsed / passed by the user
buildId,// buildId is used to facilitate caching of page bundles, we send it to the client so that pageloader knows where to load bundles
assetPrefix:assetPrefix===''?undefined:assetPrefix,// send assetPrefix to the client side when configured, otherwise don't sent in the resulting HTML
runtimeConfig,// runtimeConfig if provided, otherwise don't sent in the resulting HTML
nextExport,// If this is a page exported by `next export`
autoExport,// If this is an auto exported page
isFallback,dynamicIds:dynamicImportsIds.length===0?undefined:dynamicImportsIds,err:err?serializeError(dev,err):undefined,// Error if one happened, otherwise don't sent in the resulting HTML
gsp,// whether the page is getStaticProps
gssp,// whether the page is getServerSideProps
customServer,// whether the user is using a custom server
gip,// whether the page has getInitialProps
appGip,// whether the _app has getInitialProps
head:_react.default.Children.toArray(docProps.head||[]).map(elem=>{const{children}=elem==null?void 0:elem.props;return[elem==null?void 0:elem.type,{...(elem==null?void 0:elem.props),children:children?typeof children==='string'?children:children.join(''):undefined}];}).filter(Boolean)},buildManifest,docComponentsRendered,dangerousAsPath,canonicalBase,ampPath,inAmpMode,isDevelopment:!!dev,hybridAmp,dynamicImports,assetPrefix,headTags,unstable_runtimeJS,devOnlyCacheBusterQueryString,...docProps})));}const invalidKeysMsg=(methodName,invalidKeys)=>{return`Additional keys were returned from \`${methodName}\`. Properties intended for your component must be nested under the \`props\` key, e.g.:`+`\n\n\treturn { props: { title: 'My Title', content: '...' } }`+`\n\nKeys that need to be moved: ${invalidKeys.join(', ')}.`+`\nRead more: https://err.sh/next.js/invalid-getstaticprops-value`;};function checkRedirectValues(redirect,req){const{destination,permanent}=redirect;let invalidPermanent=typeof permanent!=='boolean';let invalidDestination=typeof destination!=='string';if(invalidPermanent||invalidDestination){throw new Error(`Invalid redirect object returned from getStaticProps for ${req.url}\n`+`Expected${invalidPermanent?` \`permanent\` to be boolean but received ${typeof permanent}`:''}${invalidPermanent&&invalidDestination?' and':''}${invalidDestination?` \`destinatino\` to be string but received ${typeof destination}`:''}\n`+`See more info here: https://err.sh/vercel/next.js/invalid-redirect-gssp`);}}function handleRedirect(res,redirect){const statusCode=redirect.permanent?_constants2.PERMANENT_REDIRECT_STATUS:_constants2.TEMPORARY_REDIRECT_STATUS;if(redirect.permanent){res.setHeader('Refresh',`0;url=${redirect.destination}`);}res.statusCode=statusCode;res.setHeader('Location',redirect.destination);res.end();}async function renderToHTML(req,res,pathname,query,renderOpts){var _props;// In dev we invalidate the cache by appending a timestamp to the resource URL.
// This is a workaround to fix https://github.com/vercel/next.js/issues/5860
// TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
renderOpts.devOnlyCacheBusterQueryString=renderOpts.dev?renderOpts.devOnlyCacheBusterQueryString||`?ts=${Date.now()}`:'';const{err,dev=false,ampPath='',App,Document,pageConfig={},Component,buildManifest,fontManifest,reactLoadableManifest,ErrorDebug,getStaticProps,getStaticPaths,getServerSideProps,isDataReq,params,previewProps,basePath,devOnlyCacheBusterQueryString}=renderOpts;const getFontDefinition=url=>{if(fontManifest){return(0,_fontUtils.getFontDefinitionFromManifest)(url,fontManifest);}return'';};const callMiddleware=async(method,args,props=false)=>{let results=props?{}:[];if(Document[`${method}Middleware`]){let middlewareFunc=await Document[`${method}Middleware`];middlewareFunc=middlewareFunc.default||middlewareFunc;const curResults=await middlewareFunc(...args);if(props){for(const result of curResults){results={...results,...result};}}else{results=curResults;}}return results;};const headTags=(...args)=>callMiddleware('headTags',args);const isFallback=!!query.__nextFallback;delete query.__nextFallback;const isSSG=!!getStaticProps;const isBuildTimeSSG=isSSG&&renderOpts.nextExport;const defaultAppGetInitialProps=App.getInitialProps===App.origGetInitialProps;const hasPageGetInitialProps=!!Component.getInitialProps;const pageIsDynamic=(0,_isDynamic.isDynamicRoute)(pathname);const isAutoExport=!hasPageGetInitialProps&&defaultAppGetInitialProps&&!isSSG&&!getServerSideProps;for(const methodName of['getStaticProps','getServerSideProps','getStaticPaths']){if(Component[methodName]){throw new Error(`page ${pathname} ${methodName} ${_constants.GSSP_COMPONENT_MEMBER_ERROR}`);}}if(hasPageGetInitialProps&&isSSG){throw new Error(_constants.SSG_GET_INITIAL_PROPS_CONFLICT+` ${pathname}`);}if(hasPageGetInitialProps&&getServerSideProps){throw new Error(_constants.SERVER_PROPS_GET_INIT_PROPS_CONFLICT+` ${pathname}`);}if(getServerSideProps&&isSSG){throw new Error(_constants.SERVER_PROPS_SSG_CONFLICT+` ${pathname}`);}if(!!getStaticPaths&&!isSSG){throw new Error(`getStaticPaths was added without a getStaticProps in ${pathname}. Without getStaticProps, getStaticPaths does nothing`);}if(isSSG&&pageIsDynamic&&!getStaticPaths){throw new Error(`getStaticPaths is required for dynamic SSG pages and is missing for '${pathname}'.`+`\nRead more: https://err.sh/next.js/invalid-getstaticpaths-value`);}if(dev){const{isValidElementType}=require('react-is');if(!isValidElementType(Component)){throw new Error(`The default export is not a React Component in page: "${pathname}"`);}if(!isValidElementType(App)){throw new Error(`The default export is not a React Component in page: "/_app"`);}if(!isValidElementType(Document)){throw new Error(`The default export is not a React Component in page: "/_document"`);}if(isAutoExport||isFallback){// remove query values except ones that will be set during export
query={...(query.amp?{amp:query.amp}:{})};req.url=pathname;renderOpts.resolvedAsPath=pathname;renderOpts.nextExport=true;}if(pathname==='/404'&&(hasPageGetInitialProps||getServerSideProps)){throw new Error(_constants.PAGES_404_GET_INITIAL_PROPS_ERROR);}}if(isAutoExport)renderOpts.autoExport=true;if(isSSG)renderOpts.nextExport=false;await _loadable.default.preloadAll();// Make sure all dynamic imports are loaded
// url will always be set
const asPath=renderOpts.resolvedAsPath||req.url;const router=new ServerRouter(pathname,query,asPath,{isFallback:isFallback},basePath);const ctx={err,req:isAutoExport?undefined:req,res:isAutoExport?undefined:res,pathname,query,asPath,AppTree:props=>{return/*#__PURE__*/_react.default.createElement(AppContainer,null,/*#__PURE__*/_react.default.createElement(App,Object.assign({},props,{Component:Component,router:router})));}};let props;const ampState={ampFirst:pageConfig.amp===true,hasQuery:Boolean(query.amp),hybrid:pageConfig.amp==='hybrid'};const inAmpMode=(0,_amp.isInAmpMode)(ampState);const reactLoadableModules=[];let head=(0,_head.defaultHead)(inAmpMode);const AppContainer=({children})=>/*#__PURE__*/_react.default.createElement(_routerContext.RouterContext.Provider,{value:router},/*#__PURE__*/_react.default.createElement(_ampContext.AmpStateContext.Provider,{value:ampState},/*#__PURE__*/_react.default.createElement(_headManagerContext.HeadManagerContext.Provider,{value:{updateHead:state=>{head=state;},mountedInstances:new Set()}},/*#__PURE__*/_react.default.createElement(_loadableContext.LoadableContext.Provider,{value:moduleName=>reactLoadableModules.push(moduleName)},children))));try{props=await(0,_utils.loadGetInitialProps)(App,{AppTree:ctx.AppTree,Component,router,ctx});if(isSSG){props[_constants2.STATIC_PROPS_ID]=true;}let previewData;if((isSSG||getServerSideProps)&&!isFallback){// Reads of this are cached on the `req` object, so this should resolve
// instantly. There's no need to pass this data down from a previous
// invoke, where we'd have to consider server & serverless.
previewData=(0,_apiUtils.tryGetPreviewData)(req,res,previewProps);}if(isSSG&&!isFallback){let data;try{data=await getStaticProps({...(pageIsDynamic?{params:query}:undefined),...(previewData!==false?{preview:true,previewData:previewData}:undefined)});}catch(staticPropsError){// remove not found error code to prevent triggering legacy
// 404 rendering
if(staticPropsError.code==='ENOENT'){delete staticPropsError.code;}throw staticPropsError;}if(data==null){throw new Error(_constants.GSP_NO_RETURNED_VALUE);}const invalidKeys=Object.keys(data).filter(key=>key!=='revalidate'&&key!=='props'&&key!=='unstable_redirect');if(invalidKeys.includes('unstable_revalidate')){throw new Error(_constants.UNSTABLE_REVALIDATE_RENAME_ERROR);}if(invalidKeys.length){throw new Error(invalidKeysMsg('getStaticProps',invalidKeys));}if(data.unstable_redirect&&typeof data.unstable_redirect==='object'){checkRedirectValues(data.unstable_redirect,req);if(isBuildTimeSSG){throw new Error(`\`redirect\` can not be returned from getStaticProps during prerendering (${req.url})\n`+`See more info here: https://err.sh/next.js/gsp-redirect-during-prerender`);}if(isDataReq){data.props={__N_REDIRECT:data.unstable_redirect.destination};}else{handleRedirect(res,data.unstable_redirect);return null;}}if((dev||isBuildTimeSSG)&&!(0,_isSerializableProps.isSerializableProps)(pathname,'getStaticProps',data.props)){// this fn should throw an error instead of ever returning `false`
throw new Error('invariant: getStaticProps did not return valid props. Please report this.');}if(typeof data.revalidate==='number'){if(!Number.isInteger(data.revalidate)){throw new Error(`A page's revalidate option must be seconds expressed as a natural number. Mixed numbers, such as '${data.revalidate}', cannot be used.`+`\nTry changing the value to '${Math.ceil(data.revalidate)}' or using \`Math.ceil()\` if you're computing the value.`);}else if(data.revalidate<=0){throw new Error(`A page's revalidate option can not be less than or equal to zero. A revalidate option of zero means to revalidate after _every_ request, and implies stale data cannot be tolerated.`+`\n\nTo never revalidate, you can set revalidate to \`false\` (only ran once at build-time).`+`\nTo revalidate as soon as possible, you can set the value to \`1\`.`);}else if(data.revalidate>31536000){// if it's greater than a year for some reason error
console.warn(`Warning: A page's revalidate option was set to more than a year. This may have been done in error.`+`\nTo only run getStaticProps at build-time and not revalidate at runtime, you can set \`revalidate\` to \`false\`!`);}}else if(data.revalidate===true){// When enabled, revalidate after 1 second. This value is optimal for
// the most up-to-date page possible, but without a 1-to-1
// request-refresh ratio.
data.revalidate=1;}else{// By default, we never revalidate.
data.revalidate=false;}props.pageProps=Object.assign({},props.pageProps,data.props)// pass up revalidate and props for export
// TODO: change this to a different passing mechanism
;renderOpts.revalidate=data.revalidate;renderOpts.pageData=props;}if(getServerSideProps){props[_constants2.SERVER_PROPS_ID]=true;}if(getServerSideProps&&!isFallback){let data;try{data=await getServerSideProps({req,res,query,resolvedUrl:renderOpts.resolvedUrl,...(pageIsDynamic?{params:params}:undefined),...(previewData!==false?{preview:true,previewData:previewData}:undefined)});}catch(serverSidePropsError){// remove not found error code to prevent triggering legacy
// 404 rendering
if(serverSidePropsError.code==='ENOENT'){delete serverSidePropsError.code;}throw serverSidePropsError;}if(data==null){throw new Error(_constants.GSSP_NO_RETURNED_VALUE);}const invalidKeys=Object.keys(data).filter(key=>key!=='props'&&key!=='unstable_redirect');if(invalidKeys.length){throw new Error(invalidKeysMsg('getServerSideProps',invalidKeys));}if(data.unstable_redirect&&typeof data.unstable_redirect==='object'){checkRedirectValues(data.unstable_redirect,req);if(isDataReq){data.props={__N_REDIRECT:data.unstable_redirect.destination};}else{handleRedirect(res,data.unstable_redirect);return null;}}if((dev||isBuildTimeSSG)&&!(0,_isSerializableProps.isSerializableProps)(pathname,'getServerSideProps',data.props)){// this fn should throw an error instead of ever returning `false`
throw new Error('invariant: getServerSideProps did not return valid props. Please report this.');}props.pageProps=Object.assign({},props.pageProps,data.props);renderOpts.pageData=props;}}catch(dataFetchError){if(isDataReq||!dev||!dataFetchError)throw dataFetchError;ctx.err=dataFetchError;renderOpts.err=dataFetchError;console.error(dataFetchError);}if(!isSSG&&// we only show this warning for legacy pages
!getServerSideProps&&process.env.NODE_ENV!=='production'&&Object.keys(((_props=props)==null?void 0:_props.pageProps)||{}).includes('url')){console.warn(`The prop \`url\` is a reserved prop in Next.js for legacy reasons and will be overridden on page ${pathname}\n`+`See more info here: https://err.sh/vercel/next.js/reserved-page-prop`);}// We only need to do this if we want to support calling
// _app's getInitialProps for getServerSideProps if not this can be removed
if(isDataReq&&!isSSG)return props;// We don't call getStaticProps or getServerSideProps while generating
// the fallback so make sure to set pageProps to an empty object
if(isFallback){props.pageProps={};}// the response might be finished on the getInitialProps call
if((0,_utils.isResSent)(res)&&!isSSG)return null;// we preload the buildManifest for auto-export dynamic pages
// to speed up hydrating query values
let filteredBuildManifest=buildManifest;if(isAutoExport&&pageIsDynamic){const page=(0,_denormalizePagePath.denormalizePagePath)((0,_normalizePagePath.normalizePagePath)(pathname));// This code would be much cleaner using `immer` and directly pushing into
// the result from `getPageFiles`, we could maybe consider that in the
// future.
if(page in filteredBuildManifest.pages){filteredBuildManifest={...filteredBuildManifest,pages:{...filteredBuildManifest.pages,[page]:[...filteredBuildManifest.pages[page],...filteredBuildManifest.lowPriorityFiles.filter(f=>f.includes('_buildManifest'))]},lowPriorityFiles:filteredBuildManifest.lowPriorityFiles.filter(f=>!f.includes('_buildManifest'))};}}const renderPage=(options={})=>{if(ctx.err&&ErrorDebug){return{html:(0,_server.renderToString)(/*#__PURE__*/_react.default.createElement(ErrorDebug,{error:ctx.err})),head};}if(dev&&(props.router||props.Component)){throw new Error(`'router' and 'Component' can not be returned in getInitialProps from _app.js https://err.sh/vercel/next.js/cant-override-next-props`);}const{App:EnhancedApp,Component:EnhancedComponent}=enhanceComponents(options,App,Component);const html=(0,_server.renderToString)(/*#__PURE__*/_react.default.createElement(AppContainer,null,/*#__PURE__*/_react.default.createElement(EnhancedApp,Object.assign({Component:EnhancedComponent,router:router},props))));return{html,head};};const documentCtx={...ctx,renderPage};const docProps=await(0,_utils.loadGetInitialProps)(Document,documentCtx);// the response might be finished on the getInitialProps call
if((0,_utils.isResSent)(res)&&!isSSG)return null;if(!docProps||typeof docProps.html!=='string'){const message=`"${(0,_utils.getDisplayName)(Document)}.getInitialProps()" should resolve to an object with a "html" prop set with a valid html string`;throw new Error(message);}const dynamicImportIdsSet=new Set();const dynamicImports=[];for(const mod of reactLoadableModules){const manifestItem=reactLoadableManifest[mod];if(manifestItem){manifestItem.forEach(item=>{dynamicImports.push(item);dynamicImportIdsSet.add(item.id);});}}const dynamicImportsIds=[...dynamicImportIdsSet];const hybridAmp=ampState.hybrid;// update renderOpts so export knows current state
renderOpts.inAmpMode=inAmpMode;renderOpts.hybridAmp=hybridAmp;const docComponentsRendered={};let html=renderDocument(Document,{...renderOpts,docComponentsRendered,buildManifest:filteredBuildManifest,// Only enabled in production as development mode has features relying on HMR (style injection for example)
unstable_runtimeJS:process.env.NODE_ENV==='production'?pageConfig.unstable_runtimeJS:undefined,dangerousAsPath:router.asPath,ampState,props,headTags:await headTags(documentCtx),isFallback,docProps,pathname,ampPath,query,inAmpMode,hybridAmp,dynamicImportsIds,dynamicImports,gsp:!!getStaticProps?true:undefined,gssp:!!getServerSideProps?true:undefined,gip:hasPageGetInitialProps?true:undefined,appGip:!defaultAppGetInitialProps?true:undefined,devOnlyCacheBusterQueryString});if(process.env.NODE_ENV!=='production'){const nonRenderedComponents=[];const expectedDocComponents=['Main','Head','NextScript','Html'];for(const comp of expectedDocComponents){if(!docComponentsRendered[comp]){nonRenderedComponents.push(comp);}}const plural=nonRenderedComponents.length!==1?'s':'';if(nonRenderedComponents.length){const missingComponentList=nonRenderedComponents.map(e=>`<${e} />`).join(', ');(0,_log.warn)(`Your custom Document (pages/_document) did not render all the required subcomponent${plural}.\n`+`Missing component${plural}: ${missingComponentList}\n`+'Read how to fix here: https://err.sh/next.js/missing-document-component');}}if(inAmpMode&&html){// inject HTML to AMP_RENDER_TARGET to allow rendering
// directly to body in AMP mode
const ampRenderIndex=html.indexOf(_constants2.AMP_RENDER_TARGET);html=html.substring(0,ampRenderIndex)+`<!-- __NEXT_DATA__ -->${docProps.html}`+html.substring(ampRenderIndex+_constants2.AMP_RENDER_TARGET.length);html=await(0,_optimizeAmp.default)(html,renderOpts.ampOptimizerConfig);if(!renderOpts.ampSkipValidation&&renderOpts.ampValidator){await renderOpts.ampValidator(html,pathname);}}html=await(0,_postProcess.default)(html,{getFontDefinition},{optimizeFonts:renderOpts.optimizeFonts,optimizeImages:renderOpts.optimizeImages});if(inAmpMode||hybridAmp){// fix &amp being escaped for amphtml rel link
html=html.replace(/&amp;amp=1/g,'&amp=1');}return html;}function errorToJSON(err){const{name,message,stack}=err;return{name,message,stack};}function serializeError(dev,err){if(dev){return errorToJSON(err);}return{name:'Internal Server Error.',message:'500 - Internal Server Error.',statusCode:500};}
//# sourceMappingURL=render.js.map