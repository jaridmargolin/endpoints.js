/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */

define([
  'assist/isNull',
  'assist/isUndefined',
  'assist/jsonClone',
  'assist/snip'
], function (isNull, isUndefined, jsonClone, snip) {


/* -----------------------------------------------------------------------------
 * utils
 * ---------------------------------------------------------------------------*/

// proxy already built utils
var _ = {
  isNull: isNull,
  isUndefined: isUndefined,
  jsonClone: jsonClone,
  snip: snip
};


/**
 * Shallow merge properties from object to
 * another object.
 *
 * @example
 * dest = _.merge(dest, obj);
 *
 * @public
 *
 * @param {object} dest - Object to merge properties into.
 * @param {object} obj - Object to merge properties from.
 * @returns {object} dest - The passed destination object with
 *   properties merged.
 */
_.merge = function (dest, obj) {
  for (var k in obj) {
    dest[k] = obj[k];
  }

  return dest;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return _;


});