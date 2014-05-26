/*!
 * utils/param.js
 * 
 * Copyright (c) 2014
 */

define(function () {


// ----------------------------------------------------------------------------
// param
//
// Create query string from object key value pairs.
// ----------------------------------------------------------------------------

var param = function (obj) {
  var str = '';
  for (var key in obj) {
    if (str !== '') { str += '&'; }
    str += key + '=' + obj[key];
  }

  return str;
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return param;


});