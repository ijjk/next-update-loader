"use strict";exports.__esModule=true;exports.default=initHeadManager;var _react=require("react");const DOMAttributeNames={acceptCharset:'accept-charset',className:'class',htmlFor:'for',httpEquiv:'http-equiv'};function reactElementToDOM({type,props}){const el=document.createElement(type);for(const p in props){if(!props.hasOwnProperty(p))continue;if(p==='children'||p==='dangerouslySetInnerHTML')continue;// we don't render undefined props to the DOM
if(props[p]===undefined)continue;const attr=DOMAttributeNames[p]||p.toLowerCase();el.setAttribute(attr,props[p]);}const{children,dangerouslySetInnerHTML}=props;if(dangerouslySetInnerHTML){el.innerHTML=dangerouslySetInnerHTML.__html||'';}else if(children){el.textContent=typeof children==='string'?children:Array.isArray(children)?children.join(''):'';}return el;}function updateElements(elements,components,removeOldTags){const headEl=document.getElementsByTagName('head')[0];const oldTags=new Set(elements);components.forEach(tag=>{if(tag.type==='title'){let title='';if(tag){const{children}=tag.props;title=typeof children==='string'?children:Array.isArray(children)?children.join(''):'';}if(title!==document.title)document.title=title;return;}const newTag=reactElementToDOM(tag);const elementIter=elements.values();while(true){// Note: We don't use for-of here to avoid needing to polyfill it.
const{done,value}=elementIter.next();if(value==null?void 0:value.isEqualNode(newTag)){oldTags.delete(value);return;}if(done){break;}}elements.add(newTag);headEl.appendChild(newTag);});oldTags.forEach(oldTag=>{if(removeOldTags){oldTag.parentNode.removeChild(oldTag);}elements.delete(oldTag);});}function initHeadManager(initialHeadEntries){const headEl=document.getElementsByTagName('head')[0];const elements=new Set(headEl.children);updateElements(elements,initialHeadEntries.map(([type,props])=>/*#__PURE__*/(0,_react.createElement)(type,props)),false);let updatePromise=null;return{mountedInstances:new Set(),updateHead:head=>{const promise=updatePromise=Promise.resolve().then(()=>{if(promise!==updatePromise)return;updatePromise=null;updateElements(elements,head,true);});}};}
//# sourceMappingURL=head-manager.js.map