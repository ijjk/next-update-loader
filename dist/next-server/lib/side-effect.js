"use strict";exports.__esModule=true;exports.default=void 0;var _react=require("react");const isServer=typeof window==='undefined';class _default extends _react.Component{constructor(props){super(props);this.emitChange=()=>{this.props.headManager.updateHead(this.props.reduceComponentsToState([...this.props.headManager.mountedInstances],this.props));};if(isServer){this.props.headManager.mountedInstances.add(this);this.emitChange();}}componentDidMount(){this.props.headManager.mountedInstances.add(this);this.emitChange();}componentDidUpdate(){this.emitChange();}componentWillUnmount(){this.props.headManager.mountedInstances.delete(this);this.emitChange();}render(){return null;}}exports.default=_default;
//# sourceMappingURL=side-effect.js.map