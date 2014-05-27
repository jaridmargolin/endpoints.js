/*!
 * resource.js
 * 
 * Copyright (c) 2014
 */

var bind = require('lodash/functions/bind');
var assign = require('lodash/objects/assign');
var decorate = require('endpoints/utils/decorate');
var param = require('endpoints/utils/param');


// ----------------------------------------------------------------------------
// Resource
//
// Creates indiviudal endpoints and responsible for correctly formatting
// specific request types (GET, POST, DELETE, etc..)
// ----------------------------------------------------------------------------

var Resource = function (ajax, configuration, decorators, resource, context) {
  // Need to set passed opts as instance vars.
  this.ajax = ajax;
  this.configuration = configuration;
  this.decorators = decorators;
  this.context = context;

  // Initiate resource
  for (var key in resource) {
    this[key] = this._create(resource[key]);
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
  return bind(function (opts, returns) {
    // Call data obj copies current configuration
    var options = assign({}, this.configuration.options);

    // Set endpoint base props
    options.url += endpoint.path;
    options.type = endpoint.type;

    // Add user opts to call options
    assign(options, opts);

    // Alter opts before request call. Before is called
    // with the context of the endpoints instance, so that
    // the endpoint may have access to any values attached
    // directly to the instance.
    if (endpoint.before) {
      endpoint.before.call(this.context, options);
    }

    // Add decorators
    for (var prop in this.decorators) {
      decorate(options, prop, this.decorators[prop]);
    }

    // Format options depending on call type.
    this['_' + endpoint.type](options);

    // Make call or return opts object
    return returns ? options : this.ajax(options);
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
    opts.url += '?' + param(opts.data);
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
    opts.url += '?' + param(opts.data);
    delete opts.data;
  }
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------

module.exports = Resource;


