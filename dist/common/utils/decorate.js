/*!
 * utils/decorate.js
 * 
 * Copyright (c) 2014
 */

var wrap = require('lodash/functions/wrap');


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

module.exports = decorate;


