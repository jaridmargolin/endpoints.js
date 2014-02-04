/*!
 * resource.js
 * 
 * Copyright (c) 2014
 */

define([
  'jquery',
  'utils'
], function ($, utils) {


// ----------------------------------------------------------------------------
// Resource class
// ----------------------------------------------------------------------------
var Resource = function (endpoints, config) {
  for (var key in endpoints) {
    this[key] = this._create(endpoints[key]);
  }

  // Set resource config instance
  this.config = config;
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
  return utils.handler(function (opts, getOpts) {
    // New base based off config
    var base = $.extend({}, this.config.get('defaults'));

    // Set endpoint base props
    base.url += endpoint.path;
    base.type = endpoint.type;

    // Extend base with opts
    opts = $.extend(base, opts);

    // Alter opts before request call
    if (endpoint.before) {
      endpoint.before(opts);
    }

    // Request call
    this['_' + endpoint.type](opts);

    // Make call or return opts object
    return getOpts ? opts : $.ajax(opts);
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
    opts.url += '?' + $.param(opts.data);
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
    opts.url += '?' + $.param(opts.data);
    delete opts.data;
  }
};

// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return Resource;


});