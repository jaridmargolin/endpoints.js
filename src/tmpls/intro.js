;(function (root, factory) {

  // --------------------------------------------------------------------------
  // UMD wrapper (returnExports)
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  //
  // I don't love the redundancy in how the dependencies are defined but my
  // attempt to make this DRY backfired while using the r.js optimizer.
  // Apparently the supported UMD definitions can be found here:
  // https://github.com/umdjs/umd
  //
  // Also would like to investigate implementing. Would be nice if this was
  // mixed into amdclean as an option:
  // https://github.com/alexlawrence/grunt-umd
  // --------------------------------------------------------------------------
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('underscore'));
  } else {
    // Browser globals (root is window)
    root['endpoints'] = factory(root._);
  }
}(this, function (underscore) {