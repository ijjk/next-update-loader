"use strict";exports.__esModule=true;exports.cancelIdleCallback=exports.requestIdleCallback=void 0;const requestIdleCallback=typeof self!=='undefined'&&self.requestIdleCallback||function(cb){let start=Date.now();return setTimeout(function(){cb({didTimeout:false,timeRemaining:function(){return Math.max(0,50-(Date.now()-start));}});},1);};exports.requestIdleCallback=requestIdleCallback;const cancelIdleCallback=typeof self!=='undefined'&&self.cancelIdleCallback||function(id){return clearTimeout(id);};exports.cancelIdleCallback=cancelIdleCallback;
//# sourceMappingURL=request-idle-callback.js.map