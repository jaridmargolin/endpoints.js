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
  },

  //
  // Utility obj for managing namespaces
  //
  namespace: {
    //
    // Loopi over namespaced string
    //
    loop: function (obj, key, opts) {
      // Split namespace by '.'
      var parts = key.split('.');

      for (var i = 0, len = parts.length; i < len; i++) {
        // If last namespace - set value
        if (len == i+1) { 
          opts.last(obj, parts, i);
          return;
        }
        // If no namespace - create & set obj to current
        if (!obj[parts[i]]) {
          opts.missing(obj, parts, i);
        }

        obj = obj[parts[i]];
      }
    },

    //
    // Get an object prop by string namespace
    //
    get: function (obj, key) {
      var val;

      this.loop(obj, key, {
        last: function (obj, parts, i) {
          val = obj[parts[i]];
        },
        missing: function (obj, parts, i) {
          throw new Error('Object ' + parts[i] + ' does not exist');
        }
      });

      return val;
    },

    //
    // Set an object prop by string namespace
    //
    set: function (obj, key, val) {
      this.loop(obj, key, {
        last: function (obj, parts, i) {
          obj[parts[i]] = val; 
        },
        missing: function (obj, parts, i) {
          obj[parts[i]] = {};
        }
      });
    }
  }
};


});