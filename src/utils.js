/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore'
], function (_) {


// ----------------------------------------------------------------------------
// utils
// ----------------------------------------------------------------------------

var utils = {};

//
// Create query string from object key value pairs.
//
utils.param = function (obj) {
  var str = '';
  for (var key in obj) {
    if (str !== '') { str += '&'; }
    str += key + '=' + obj[key];
  }

  return str;
};

//
// Wrapper around deepMerge to allow mixin with multiple objects.
//
utils.deepExtend = function () {
  var args = Array.prototype.slice.call(arguments, 0),
      dest = args.shift();
 
  _.each(args, function (val) {
    utils.deepMerge(dest, val);
  });
 
  return dest;
};

//
// Merge props from obj to dest.
//
utils.deepMerge = function (dest, obj) {
  _.each(obj, function (objVal, key) {
    var destVal = dest[key] || {};

    // Cache info about objVal
    var isObj = _.isObject(objVal),
        isArr = _.isArray(objVal);

    if (isObj || isArr) {
      // We need to be working with the same data objects.
      // In the case they are different, objVal type will be chosen.
      if (isObj && !_.isObject(objVal)) { dest[key] = {}; }
      if (isArr && !_.isArray(objVal)) { dest[key] = []; }

      dest[key] = utils.deepMerge(destVal, objVal);
    } else {
      dest[key] = objVal;
    }
  });

  return dest;
};

//
// Decorate yo!!!
//
utils.decorate = function (obj, prop, decorator) {
  // We need to grab the current fn or create a dummy.
  var fn  = obj[prop] || function () {};

  // Only decorate functions Dawg!
  if (typeof fn === 'function') {
    obj[prop] = _.wrap(fn, decorator);
  }
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return utils;


});