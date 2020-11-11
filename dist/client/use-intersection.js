"use strict";exports.__esModule=true;exports.useIntersection=useIntersection;var _react=require("react");const hasIntersectionObserver=typeof IntersectionObserver!=='undefined';function useIntersection({rootMargin,disabled}){const isDisabled=disabled||!hasIntersectionObserver;const unobserve=(0,_react.useRef)();const[visible,setVisible]=(0,_react.useState)(false);const setRef=(0,_react.useCallback)(el=>{if(unobserve.current){unobserve.current();unobserve.current=undefined;}if(isDisabled||visible)return;if(el&&el.tagName){unobserve.current=observe(el,isVisible=>isVisible&&setVisible(isVisible),{rootMargin});}},[isDisabled,rootMargin,visible]);(0,_react.useEffect)(()=>{if(!hasIntersectionObserver){if(!visible)setVisible(true);}},[visible]);return[setRef,visible];}function observe(element,callback,options){const{id,observer,elements}=createObserver(options);elements.set(element,callback);observer.observe(element);return function unobserve(){observer.unobserve(element);// Destroy observer when there's nothing left to watch:
if(elements.size===0){observer.disconnect();observers.delete(id);}};}const observers=new Map();function createObserver(options){const id=options.rootMargin||'';let instance=observers.get(id);if(instance){return instance;}const elements=new Map();const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{const callback=elements.get(entry.target);const isVisible=entry.isIntersecting||entry.intersectionRatio>0;if(callback&&isVisible){callback(isVisible);}});},options);observers.set(id,instance={id,observer,elements});return instance;}
//# sourceMappingURL=use-intersection.js.map