/*!
 * config.js
 * 
 * Copyright (c) 2014
 */

define([
  'utils',
], function (utils) {


// ----------------------------------------------------------------------------
// Config
// ----------------------------------------------------------------------------
var Config = function () {
  this.attr = {};
};

//
// Get by namespaced string.
//
Config.prototype.get = function (key) {
  return utils.namespace.get(this.attr, key);
};

//
// Set attr object, or namespace string.
//
Config.prototype.set = function (key, val) {
  return (arguments.length == 1)
    ? (this.attr = key)
    : utils.namespace.set(this.attr, key, val);
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return Config;


});