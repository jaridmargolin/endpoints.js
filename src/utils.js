/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */

define(function () {


// ----------------------------------------------------------------------------
// Utils
// ----------------------------------------------------------------------------
return {
  //
  // Sick of caching this (var self = this;) and writing anonymous functions.
  // * Need to write a little blog post with an explanation
  //
  handler: function (method, params, context) {
    return function () {
      return (Object.prototype.toString.call(params) !== '[object Array]')
        ? method.apply(params, arguments)
        : method.apply(context, params.concat(Array.prototype.slice.call(arguments)));
    };
  }
};


});