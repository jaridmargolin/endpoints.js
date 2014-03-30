/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

define([
  'utils',
  'resource',
], function (_u_, Resource) {


// ----------------------------------------------------------------------------
// Endpoints defaults
// ----------------------------------------------------------------------------

// Basic
var defaults = {
  dataType : 'json',
  timeout  : 5000,
  headers  : {}
};

// Headers
defaults.headers = {
  'Content-Type': 'application/json'
};


// ----------------------------------------------------------------------------
// Endpoints module
//
// Module for creating client side APIs
//
// - Normalizes interface for passing data to various methods (GET, POST, DEL)
// - Provides defaults for api.
// ----------------------------------------------------------------------------

var Endpoints = function (ajax, opts) {
  var decorators = opts.decorators || {},
      resources  = opts.resources;

  // Remove all properties that are not defaults
  // *opts is now equal to defaults.
  delete opts.decorators;
  delete opts.resources;

  // Mixin module defaults with user specified defaults
  // in order to create resourceDefaults.
  this.resourceDefaults = _u_.deepExtend({}, defaults, opts);

  // Loop over resources and create endpoints. Resources are mixed into
  // the Endpoints instance for easy access.
  for (var key in resources) {
    this[key] = new Resource(ajax, this.resourceDefaults, decorators, resources[key]);
  }
};

//
// Configure is a proxy to set properties on default. Behind
// the scenes it uses a deepMerge.
//
Endpoints.prototype.configure = function (data) {
  _u_.deepMerge(this.resourceDefaults, data);
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return Endpoints;


});