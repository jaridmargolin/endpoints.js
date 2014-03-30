(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore'], function () {
      return (root.returnExportsGlobal = factory('underscore'));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory(require('underscore'));
  } else {
    root['Endpoints'] = factory(root.underscore);
  }
}(this, function (underscore) {


/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
var utils = {
    handler: function (method, params, context) {
      return function () {
        return Object.prototype.toString.call(params) !== '[object Array]' ? method.apply(params, arguments) : method.apply(context, params.concat(Array.prototype.slice.call(arguments)));
      };
    },
    param: function (obj) {
      var str = '';
      for (var key in obj) {
        if (str !== '') {
          str += '&';
        }
        str += key + '=' + obj[key];
      }
      return str;
    }
  };
/*!
 * resource.js
 * 
 * Copyright (c) 2014
 */
var resource = function (_, _u_) {
    // ----------------------------------------------------------------------------
    // Resource class
    // ----------------------------------------------------------------------------
    var Resource = function (endpoints, defaults, ajax) {
      for (var key in endpoints) {
        this[key] = this._create(endpoints[key]);
      }
      this.defaults = defaults;
      this.ajax = ajax;
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
  }(underscore, utils);
/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */
var endpoints = function (Resource) {
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
  }(resource);


return endpoints;



}));