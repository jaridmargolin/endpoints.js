/*!
 * utils/decorate.js
 * 
 * Copyright (c) 2014
 */

define([
  'lodash/functions/wrap'
], function (wrap) {


// ----------------------------------------------------------------------------
// decorate
//
// Wrap an object method with a decorator. If no
// property exists, create a dummy fn.
// ----------------------------------------------------------------------------

var decorate = function (obj, prop, decorator) {
  // We need to grab the current fn or create a dummy.
  var fn  = obj[prop] || function () {};

  // Only decorate functions Dawg!
  if (typeof fn === 'function') {
    obj[prop] = wrap(function () {
      fn.apply(obj, arguments);
    }, decorator);
  }
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return decorate;


});