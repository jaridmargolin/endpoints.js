/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */

var utils = require('mini-store/utils');
var snip = require('assist/snip');


/* -----------------------------------------------------------------------------
 * utils
 * ---------------------------------------------------------------------------*/

// proxy already built utils
var _ = {
  clone: utils.clone,
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


/**
 * Return a boolean if a given variable is undefined.
 *
 * @example
 * var isUndefined = _.isUndefined(variable);
 *
 * @public
 *
 * @param {*} variable - value to check if undefined of.
 * @returns {boolean} - result of undefined check.
 */
_.isUndefined = function (variable) {
  return typeof variable === 'undefined';
};


/**
 * Return a boolean if a given variable is null.
 *
 * @example
 * var isNull = _.isNull(variable);
 *
 * @public
 *
 * @param {*} variable - value to check if null of.
 * @returns {boolean} - result of null check.
 */
_.isNull = function (variable) {
  return variable === null;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = _;


