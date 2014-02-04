/*!
 * config.js
 * 
 * Copyright (c) 2014
 */

define(function () {


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
  return this._getKey(key);
};

//
// Set attr object, or namespace string.
//
Config.prototype.set = function (key, val) {
  return (arguments.length == 1)
    ? (this._attr = key)
    : this._setKey(key, val);
};

//
// Set namespaced value
//
Config.prototype._setKey = function (key, val) {
  var parts = key.split('.');

  for (var i = 0, len = parts.length, obj = this._attr; i < len; i++) {
    // If last namespace - set value
    if (len == i+1) {
      obj[parts[i]] = val; 
      return;
    }
    
    // If no namespace - create & set obj to current
    if (!obj[parts[i]]) { obj[parts[i]] = {}; }

    obj = obj[parts[i]];
  }
};

//
// Return namespaced key value
//
Config.prototype._getKey = function (key) {
  var parts = key.split('.');

  for (var i = 0, len = parts.length, obj = this._attr; i < len; i++) {
    // If last namespace - set value
    if (len == i+1) { return obj[parts[i]]; }
      
    // If no namespace - create & set obj to current
    if (!obj[parts[i]]) {
      throw new Error('Object ' + parts[i] + ' does not exist');
    }

    obj = obj[parts[i]];
  }
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return Config;


});