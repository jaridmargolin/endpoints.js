/*!
 * resource.js
 * 
 * Copyright (c) 2014
 */

define([
  'underscore',
  'utils'
], function (_, _u_) {


// ----------------------------------------------------------------------------
// Resource
//
// Creates indiviudal endpoints and responsible for correctly formatting
// specific request types (GET, POST, DELETE, etc..)
// ----------------------------------------------------------------------------

var Resource = function (ajax, defaults, decorators, endpoints) {
  // Need to set passed opts as instance vars.
  this.decorators = decorators;
  this.defaults = defaults;
  this.ajax = ajax;

  // Initiate resource
  for (var key in endpoints) {
    this[key] = this._create(endpoints[key]);
  }
};

//
// Create a new endpoint
//
// @params
// type (required) -- HTTP request type
// path (required) -- path from the base apiURI
//
Resource.prototype._create = function (endpoint) {
  // Return function that calls endpoint
  return _.bind(function (opts, getOpts) {
    // New base from defaults
    var base = _.extend({}, this.defaults);

    // Set endpoint base props
    base.url += endpoint.path;
    base.type = endpoint.type;

    // Extend base with opts
    opts = _.extend(base, opts);

    // Alter opts before request call
    if (endpoint.before) {
      endpoint.before(opts);
    }

    // Add decorators
    for (var prop in this.decorators) {
      _u_.decorate(opts, prop, this.decorators[prop]);
    }

    // Request call
    this['_' + endpoint.type](opts);

    // Make call or return opts object
    return getOpts ? opts : this.ajax(opts);
  }, this);
};

//
// Data is serialized and as a query str
//
// @param
// opts -- Options passed to jQuery.ajax
//
Resource.prototype._GET = function (opts) {
  if (opts.data) {
    opts.url += '?' + _u_.param(opts.data);
    delete opts.data;
  }
};

//
// Data is passed as a json string in the body
//
// @param
// opts -- Options passed to jQuery.ajax
//
Resource.prototype._POST = function (opts) {
  if (opts.data) {
    opts.data = JSON.stringify(opts.data);
  }
};

//
// Data is serialized and as a query str
//
// @param
// opts -- Options passed to jQuery.ajax
//
Resource.prototype._DELETE = function (opts) {
  if (opts.data) {
    opts.url += '?' + _u_.param(opts.data);
    delete opts.data;
  }
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

return Resource;


});