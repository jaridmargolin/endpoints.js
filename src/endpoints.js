/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

define([
  'jquery',
  'utils',
  'resource',
  'config'
], function ($, utils, Resource, Config) {


// ----------------------------------------------------------------------------
// Endpoints module
//
// Module for creating client side APIs
//
// - Normalizes interface for passing data to various methods (GET, POST, DEL)
// - Provides defaults for api.
// ----------------------------------------------------------------------------
var Endpoints = function (opts) {
  // Create and attach a config instance to this API instance
  this.config = new Config();

  for (var key in opts.resources) {
    this[key] = new Resource(opts.resources[key], this.config);
  }

  delete opts.resources;
  this.config.set(opts);
};

//
// Call authorization. We mixin the configured id and secret.
//
Endpoints.prototype.authorize = function (data) {
  var auth  = this.config.get('authorization'),
      creds = $.extend({}, auth);
  
  // Remove the included endpoints from the cloned auth obj
  delete creds.endpoint;

  // Call auth endpoint
  var endpoint = utils.namespace.get(this, auth.endpoint);
  endpoint($.extend(creds, data));
};

//
// Set configuration. Use to alter global defualts.
//
Endpoints.prototype.set = function (key, val) {
  this.config.set(key, val);
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return Endpoints;


});