/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

var bind = require('lodash/functions/bind');
var Configuration = require('configuration');
var Resource = require('resource');


// ----------------------------------------------------------------------------
// Endpoints module
//
// Module for creating client side APIs
//
// - Normalizes interface for passing data to various methods (GET, POST, DEL)
// - Provides defaults for api.
// ----------------------------------------------------------------------------

var Endpoints = function (ajax, options) {
  var decorators = options.decorators || {},
      resources  = options.resources;

  // Remove all properties that are not defaults
  // *options is now equal to defaults.
  delete options.decorators;
  delete options.resources;

  // Mixin module defaults with user specified defaults
  // and pass to new configuration to manage.
  var configuration  = new Endpoints.Configuration(options);

  // Add alias / attach to instance.
  this.configure = bind(configuration.set, configuration);
  this.reset = bind(configuration.reset, configuration);

  // Loop over resources and create endpoints. Resources are mixed into
  // the Endpoints instance for easy access.
  for (var key in resources) {
    this[key] = new Endpoints.Resource(ajax, configuration, decorators, resources[key], this);
  }
};

//
// I want to add Configuration and Resource to the Endpoints.
// Primarily used for mocking, but this also makes the two
// components accesible if a resource needs to be created outside
// of endpoints.
//
Endpoints.Configuration = Configuration;
Endpoints.Resource = Configuration;


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

module.exports = Endpoints;


