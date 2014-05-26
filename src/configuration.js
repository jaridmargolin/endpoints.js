/*!
 * configuration.js
 * 
 * Copyright (c) 2014
 */

define([
  'lodash/objects/merge'
], function (merge) {


// ----------------------------------------------------------------------------
// Defaults
// ----------------------------------------------------------------------------

var defaults = {
  dataType : 'json',
  timeout  : 5000,
  headers  : {
    'Content-Type': 'application/json'
  }
};


// ----------------------------------------------------------------------------
// Configuration
// ----------------------------------------------------------------------------

var Configuration = function (options) {
  this.original = merge(defaults, options);
  this.reset();
};

//
// Configure is a proxy to set properties on default. Behind
// the scenes it uses a deepMerge.
//
Configuration.prototype.set = function (data) {
  merge(this.options, data);
};

//
// Override all config options (set using Endpoints.prototype.configure).
//
Configuration.prototype.reset = function () {
  this.options = merge({}, this.original);
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return Configuration;


});




