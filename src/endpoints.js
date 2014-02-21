/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

define([
  'resource',
], function (Resource) {


// ----------------------------------------------------------------------------
// Endpoints module
//
// Module for creating client side APIs
//
// - Normalizes interface for passing data to various methods (GET, POST, DEL)
// - Provides defaults for api.
// ----------------------------------------------------------------------------
var Endpoints = function (ajax, opts) {
  for (var key in opts.resources) {
    this[key] = new Resource(opts.resources[key], opts, ajax);
  }

  delete opts.resources;
  this.defaults = opts;
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return Endpoints;


});