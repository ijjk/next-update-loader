"use strict";exports.__esModule=true;exports.Html=Html;exports.Main=Main;exports.NextScript=exports.Head=exports.default=void 0;var _propTypes=_interopRequireDefault(require("prop-types"));var _react=_interopRequireWildcard(require("react"));var _server=_interopRequireDefault(require("styled-jsx/server"));var _constants=require("../next-server/lib/constants");var _documentContext=require("../next-server/lib/document-context");var _utils=require("../next-server/lib/utils");exports.DocumentContext=_utils.DocumentContext;exports.DocumentInitialProps=_utils.DocumentInitialProps;exports.DocumentProps=_utils.DocumentProps;var _utils2=require("../next-server/server/utils");var _htmlescape=require("../server/htmlescape");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _getRequireWildcardCache(){if(typeof WeakMap!=="function")return null;var cache=new WeakMap();_getRequireWildcardCache=function(){return cache;};return cache;}function _interopRequireWildcard(obj){if(obj&&obj.__esModule){return obj;}if(obj===null||typeof obj!=="object"&&typeof obj!=="function"){return{default:obj};}var cache=_getRequireWildcardCache();if(cache&&cache.has(obj)){return cache.get(obj);}var newObj={};var hasPropertyDescriptor=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var key in obj){if(Object.prototype.hasOwnProperty.call(obj,key)){var desc=hasPropertyDescriptor?Object.getOwnPropertyDescriptor(obj,key):null;if(desc&&(desc.get||desc.set)){Object.defineProperty(newObj,key,desc);}else{newObj[key]=obj[key];}}}newObj.default=obj;if(cache){cache.set(obj,newObj);}return newObj;}function dedupe(bundles){const files=new Set();const kept=[];for(const bundle of bundles){if(files.has(bundle.file))continue;files.add(bundle.file);kept.push(bundle);}return kept;}function getOptionalModernScriptVariant(path){if(process.env.__NEXT_MODERN_BUILD){return path.replace(/\.js$/,'.module.js');}return path;}/**
 * `Document` component handles the initial `document` markup and renders only on the server side.
 * Commonly used for implementing server side rendering for `css-in-js` libraries.
 */class Document extends _react.Component{/**
   * `getInitialProps` hook returns the context object with the addition of `renderPage`.
   * `renderPage` callback executes `React` rendering logic synchronously to support server-rendering wrappers
   */static async getInitialProps(ctx){const enhancers=process.env.__NEXT_PLUGINS?await Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=unstable-enhance-app-server!'))).then(mod=>mod.default(ctx)):[];const enhanceApp=App=>{for(const enhancer of enhancers){App=enhancer(App);}return props=>/*#__PURE__*/_react.default.createElement(App,props);};const{html,head}=await ctx.renderPage({enhanceApp});const styles=[...(0,_server.default)(),...(process.env.__NEXT_PLUGINS?await Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=unstable-get-styles-server!'))).then(mod=>mod.default(ctx)):[])];return{html,head,styles};}static renderDocument(DocumentComponent,props){return/*#__PURE__*/_react.default.createElement(_documentContext.DocumentContext.Provider,{value:{_documentProps:props,// In dev we invalidate the cache by appending a timestamp to the resource URL.
// This is a workaround to fix https://github.com/vercel/next.js/issues/5860
// TODO: remove this workaround when https://bugs.webkit.org/show_bug.cgi?id=187726 is fixed.
_devOnlyInvalidateCacheQueryString:process.env.NODE_ENV!=='production'?'?ts='+Date.now():''}},/*#__PURE__*/_react.default.createElement(DocumentComponent,props));}render(){return/*#__PURE__*/_react.default.createElement(Html,null,/*#__PURE__*/_react.default.createElement(Head,null),/*#__PURE__*/_react.default.createElement("body",null,/*#__PURE__*/_react.default.createElement(Main,null),/*#__PURE__*/_react.default.createElement(NextScript,null)));}}exports.default=Document;Document.headTagsMiddleware=process.env.__NEXT_PLUGINS?Promise.resolve().then(()=>_interopRequireWildcard(require('next-plugin-loader?middleware=document-head-tags-server!'))):()=>[];function Html(props){const{inAmpMode}=(0,_react.useContext)(_documentContext.DocumentContext)._documentProps;return/*#__PURE__*/_react.default.createElement("html",Object.assign({},props,{amp:inAmpMode?'':undefined,"data-ampdevmode":inAmpMode&&process.env.NODE_ENV!=='production'?'':undefined}));}class Head extends _react.Component{constructor(...args){super(...args);this.context=void 0;}getCssLinks(){const{assetPrefix,files}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const cssFiles=files&&files.length?files.filter(f=>f.endsWith('.css')):[];const cssLinkElements=[];cssFiles.forEach(file=>{cssLinkElements.push(/*#__PURE__*/_react.default.createElement("link",{key:`${file}-preload`,nonce:this.props.nonce,rel:"preload",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,as:"style",crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN}),/*#__PURE__*/_react.default.createElement("link",{key:file,nonce:this.props.nonce,rel:"stylesheet",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN}));});return cssLinkElements.length===0?null:cssLinkElements;}getPreloadDynamicChunks(){const{dynamicImports,assetPrefix}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return dedupe(dynamicImports).map(bundle=>{// `dynamicImports` will contain both `.js` and `.module.js` when the
// feature is enabled. This clause will filter down to the modern
// variants only.
if(!bundle.file.endsWith(getOptionalModernScriptVariant('.js'))){return null;}return/*#__PURE__*/_react.default.createElement("link",{rel:"preload",key:bundle.file,href:`${assetPrefix}/_next/${encodeURI(bundle.file)}${_devOnlyInvalidateCacheQueryString}`,as:"script",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN});})// Filter out nulled scripts
.filter(Boolean);}getPreloadMainLinks(){const{assetPrefix,files}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const preloadFiles=files&&files.length?files.filter(file=>{// `dynamicImports` will contain both `.js` and `.module.js` when
// the feature is enabled. This clause will filter down to the
// modern variants only.
return file.endsWith(getOptionalModernScriptVariant('.js'));}):[];return!preloadFiles.length?null:preloadFiles.map(file=>/*#__PURE__*/_react.default.createElement("link",{key:file,nonce:this.props.nonce,rel:"preload",href:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,as:"script",crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN}));}render(){const{styles,ampPath,inAmpMode,hybridAmp,canonicalBase,__NEXT_DATA__,dangerousAsPath,headTags,unstable_runtimeJS}=this.context._documentProps;const disableRuntimeJS=unstable_runtimeJS===false;let{head}=this.context._documentProps;let children=this.props.children;// show a warning if Head contains <title> (only in development)
if(process.env.NODE_ENV!=='production'){children=_react.default.Children.map(children,child=>{var _child$props;const isReactHelmet=child===null||child===void 0?void 0:(_child$props=child.props)===null||_child$props===void 0?void 0:_child$props['data-react-helmet'];if((child===null||child===void 0?void 0:child.type)==='title'&&!isReactHelmet){console.warn("Warning: <title> should not be used in _document.js's <Head>. https://err.sh/next.js/no-document-title");}return child;});if(this.props.crossOrigin)console.warn('Warning: `Head` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated');}let hasAmphtmlRel=false;let hasCanonicalRel=false;// show warning and remove conflicting amp head tags
head=_react.default.Children.map(head||[],child=>{if(!child)return child;const{type,props}=child;if(inAmpMode){let badProp='';if(type==='meta'&&props.name==='viewport'){badProp='name="viewport"';}else if(type==='link'&&props.rel==='canonical'){hasCanonicalRel=true;}else if(type==='script'){// only block if
// 1. it has a src and isn't pointing to ampproject's CDN
// 2. it is using dangerouslySetInnerHTML without a type or
// a type of text/javascript
if(props.src&&props.src.indexOf('ampproject')<-1||props.dangerouslySetInnerHTML&&(!props.type||props.type==='text/javascript')){badProp='<script';Object.keys(props).forEach(prop=>{badProp+=` ${prop}="${props[prop]}"`;});badProp+='/>';}}if(badProp){console.warn(`Found conflicting amp tag "${child.type}" with conflicting prop ${badProp} in ${__NEXT_DATA__.page}. https://err.sh/next.js/conflicting-amp-tag`);return null;}}else{// non-amp mode
if(type==='link'&&props.rel==='amphtml'){hasAmphtmlRel=true;}}return child;});// try to parse styles from fragment for backwards compat
const curStyles=Array.isArray(styles)?styles:[];if(inAmpMode&&styles&&// @ts-ignore Property 'props' does not exist on type ReactElement
styles.props&&// @ts-ignore Property 'props' does not exist on type ReactElement
Array.isArray(styles.props.children)){const hasStyles=el=>{var _el$props,_el$props$dangerously;return el===null||el===void 0?void 0:(_el$props=el.props)===null||_el$props===void 0?void 0:(_el$props$dangerously=_el$props.dangerouslySetInnerHTML)===null||_el$props$dangerously===void 0?void 0:_el$props$dangerously.__html;};// @ts-ignore Property 'props' does not exist on type ReactElement
styles.props.children.forEach(child=>{if(Array.isArray(child)){child.forEach(el=>hasStyles(el)&&curStyles.push(el));}else if(hasStyles(child)){curStyles.push(child);}});}return/*#__PURE__*/_react.default.createElement("head",this.props,this.context._documentProps.isDevelopment&&/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,/*#__PURE__*/_react.default.createElement("style",{"data-next-hide-fouc":true,"data-ampdevmode":inAmpMode?'true':undefined,dangerouslySetInnerHTML:{__html:`body{display:none}`}}),/*#__PURE__*/_react.default.createElement("noscript",{"data-next-hide-fouc":true,"data-ampdevmode":inAmpMode?'true':undefined},/*#__PURE__*/_react.default.createElement("style",{dangerouslySetInnerHTML:{__html:`body{display:block}`}}))),children,head,/*#__PURE__*/_react.default.createElement("meta",{name:"next-head-count",content:_react.default.Children.count(head||[]).toString()}),inAmpMode&&/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,/*#__PURE__*/_react.default.createElement("meta",{name:"viewport",content:"width=device-width,minimum-scale=1,initial-scale=1"}),!hasCanonicalRel&&/*#__PURE__*/_react.default.createElement("link",{rel:"canonical",href:canonicalBase+(0,_utils2.cleanAmpPath)(dangerousAsPath)}),/*#__PURE__*/_react.default.createElement("link",{rel:"preload",as:"script",href:"https://cdn.ampproject.org/v0.js"}),styles&&/*#__PURE__*/_react.default.createElement("style",{"amp-custom":"",dangerouslySetInnerHTML:{__html:curStyles.map(style=>style.props.dangerouslySetInnerHTML.__html).join('').replace(/\/\*# sourceMappingURL=.*\*\//g,'').replace(/\/\*@ sourceURL=.*?\*\//g,'')}}),/*#__PURE__*/_react.default.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:`body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}`}}),/*#__PURE__*/_react.default.createElement("noscript",null,/*#__PURE__*/_react.default.createElement("style",{"amp-boilerplate":"",dangerouslySetInnerHTML:{__html:`body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}`}})),/*#__PURE__*/_react.default.createElement("script",{async:true,src:"https://cdn.ampproject.org/v0.js"})),!inAmpMode&&/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,!hasAmphtmlRel&&hybridAmp&&/*#__PURE__*/_react.default.createElement("link",{rel:"amphtml",href:canonicalBase+getAmpPath(ampPath,dangerousAsPath)}),this.getCssLinks(),!disableRuntimeJS&&this.getPreloadDynamicChunks(),!disableRuntimeJS&&this.getPreloadMainLinks(),this.context._documentProps.isDevelopment&&/*#__PURE__*/ // this element is used to mount development styles so the
// ordering matches production
// (by default, style-loader injects at the bottom of <head />)
_react.default.createElement("noscript",{id:"__next_css__DO_NOT_USE__"}),styles||null),_react.default.createElement(_react.default.Fragment,{},...(headTags||[])));}}exports.Head=Head;Head.contextType=_documentContext.DocumentContext;Head.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};function Main(){const{inAmpMode,html}=(0,_react.useContext)(_documentContext.DocumentContext)._documentProps;if(inAmpMode)return/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,_constants.AMP_RENDER_TARGET);return/*#__PURE__*/_react.default.createElement("div",{id:"__next",dangerouslySetInnerHTML:{__html:html}});}class NextScript extends _react.Component{constructor(...args){super(...args);this.context=void 0;}getDynamicChunks(){const{dynamicImports,assetPrefix,files,isDevelopment}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return dedupe(dynamicImports).map(bundle=>{let modernProps={};if(process.env.__NEXT_MODERN_BUILD){modernProps=bundle.file.endsWith('.module.js')?{type:'module'}:{noModule:true};}if(!bundle.file.endsWith('.js')||files.includes(bundle.file))return null;return/*#__PURE__*/_react.default.createElement("script",Object.assign({async:!isDevelopment,key:bundle.file,src:`${assetPrefix}/_next/${encodeURI(bundle.file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN},modernProps));});}getScripts(){var _buildManifest$lowPri;const{assetPrefix,files,buildManifest,isDevelopment}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;const normalScripts=files===null||files===void 0?void 0:files.filter(file=>file.endsWith('.js'));const lowPriorityScripts=(_buildManifest$lowPri=buildManifest.lowPriorityFiles)===null||_buildManifest$lowPri===void 0?void 0:_buildManifest$lowPri.filter(file=>file.endsWith('.js'));return[...normalScripts,...lowPriorityScripts].map(file=>{let modernProps={};if(process.env.__NEXT_MODERN_BUILD){modernProps=file.endsWith('.module.js')?{type:'module'}:{noModule:true};}return/*#__PURE__*/_react.default.createElement("script",Object.assign({key:file,src:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,async:!isDevelopment,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN},modernProps));});}getPolyfillScripts(){// polyfills.js has to be rendered as nomodule without async
// It also has to be the first script to load
const{assetPrefix,buildManifest}=this.context._documentProps;const{_devOnlyInvalidateCacheQueryString}=this.context;return buildManifest.polyfillFiles.filter(polyfill=>polyfill.endsWith('.js')&&!polyfill.endsWith('.module.js')).map(polyfill=>/*#__PURE__*/_react.default.createElement("script",{key:polyfill,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN,noModule:true,src:`${assetPrefix}/_next/${polyfill}${_devOnlyInvalidateCacheQueryString}`}));}static getInlineScriptSource(documentProps){const{__NEXT_DATA__}=documentProps;try{const data=JSON.stringify(__NEXT_DATA__);return(0,_htmlescape.htmlEscapeJsonString)(data);}catch(err){if(err.message.indexOf('circular structure')){throw new Error(`Circular structure in "getInitialProps" result of page "${__NEXT_DATA__.page}". https://err.sh/vercel/next.js/circular-structure`);}throw err;}}render(){const{assetPrefix,inAmpMode,buildManifest,unstable_runtimeJS}=this.context._documentProps;const disableRuntimeJS=unstable_runtimeJS===false;const{_devOnlyInvalidateCacheQueryString}=this.context;if(inAmpMode){if(process.env.NODE_ENV==='production'){return null;}const AmpDevFiles=[_constants.CLIENT_STATIC_FILES_RUNTIME_REACT_REFRESH,_constants.CLIENT_STATIC_FILES_RUNTIME_AMP,_constants.CLIENT_STATIC_FILES_RUNTIME_WEBPACK];return/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,disableRuntimeJS?null:/*#__PURE__*/_react.default.createElement("script",{id:"__NEXT_DATA__",type:"application/json",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN,dangerouslySetInnerHTML:{__html:NextScript.getInlineScriptSource(this.context._documentProps)},"data-ampdevmode":true}),AmpDevFiles?AmpDevFiles.map(file=>/*#__PURE__*/_react.default.createElement("script",{key:file,src:`${assetPrefix}/_next/${file}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN,"data-ampdevmode":true})):null);}if(process.env.NODE_ENV!=='production'){if(this.props.crossOrigin)console.warn('Warning: `NextScript` attribute `crossOrigin` is deprecated. https://err.sh/next.js/doc-crossorigin-deprecated');}return/*#__PURE__*/_react.default.createElement(_react.default.Fragment,null,!disableRuntimeJS&&buildManifest.devFiles?buildManifest.devFiles.map(file=>/*#__PURE__*/_react.default.createElement("script",{key:file,src:`${assetPrefix}/_next/${encodeURI(file)}${_devOnlyInvalidateCacheQueryString}`,nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN})):null,disableRuntimeJS?null:/*#__PURE__*/_react.default.createElement("script",{id:"__NEXT_DATA__",type:"application/json",nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN,dangerouslySetInnerHTML:{__html:NextScript.getInlineScriptSource(this.context._documentProps)}}),process.env.__NEXT_MODERN_BUILD&&!disableRuntimeJS?/*#__PURE__*/_react.default.createElement("script",{nonce:this.props.nonce,crossOrigin:this.props.crossOrigin||process.env.__NEXT_CROSS_ORIGIN,noModule:true,dangerouslySetInnerHTML:{__html:NextScript.safariNomoduleFix}}):null,!disableRuntimeJS&&this.getPolyfillScripts(),disableRuntimeJS?null:this.getDynamicChunks(),disableRuntimeJS?null:this.getScripts());}}exports.NextScript=NextScript;NextScript.contextType=_documentContext.DocumentContext;NextScript.propTypes={nonce:_propTypes.default.string,crossOrigin:_propTypes.default.string};NextScript.safariNomoduleFix='!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()},!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();';function getAmpPath(ampPath,asPath){return ampPath||`${asPath}${asPath.includes('?')?'&':'?'}amp=1`;}
//# sourceMappingURL=_document.js.map