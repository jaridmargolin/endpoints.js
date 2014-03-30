require('underscore')
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
var utils = function (_) {
    // ----------------------------------------------------------------------------
    // utils
    // ----------------------------------------------------------------------------
    var utils = {};
    //
    // Create query string from object key value pairs.
    //
    utils.param = function (obj) {
      var str = '';
      for (var key in obj) {
        if (str !== '') {
          str += '&';
        }
        str += key + '=' + obj[key];
      }
      return str;
    };
    //
    // Wrapper around deepMerge to allow mixin with multiple objects.
    //
    utils.deepExtend = function () {
      var args = Array.prototype.slice.call(arguments, 0), dest = args.shift();
      _.each(args, function (val) {
        utils.deepMerge(dest, val);
      });
      return dest;
    };
    //
    // Merge props from obj to dest.
    //
    utils.deepMerge = function (dest, obj) {
      _.each(obj, function (objVal, key) {
        var destVal = dest[key] || {};
        // Cache info about objVal
        var isObj = _.isObject(objVal), isArr = _.isArray(objVal);
        if (isObj || isArr) {
          // We need to be working with the same data objects.
          // In the case they are different, objVal type will be chosen.
          if (isObj && !_.isObject(objVal)) {
            dest[key] = {};
          }
          if (isArr && !_.isArray(objVal)) {
            dest[key] = [];
          }
          dest[key] = utils.deepMerge(destVal, objVal);
        } else {
          dest[key] = objVal;
        }
      });
      return dest;
    };
    //
    // Decorate yo!!!
    //
    utils.decorate = function (obj, prop, decorator) {
      // We need to grab the current fn or create a dummy.
      var fn = obj[prop] || function () {
        };
      // Only decorate functions Dawg!
      if (typeof fn === 'function') {
        obj[prop] = _.wrap(fn, decorator);
      }
    };
    // ----------------------------------------------------------------------------
    // Expose
    // ----------------------------------------------------------------------------
    return utils;
  }(underscore);
/*!
 * resource.js
 * 
 * Copyright (c) 2014
 */
var resource = function (_, _u_) {
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
  }(underscore, utils);
/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */
var endpoints = function (_u_, Resource) {
    // ----------------------------------------------------------------------------
    // Endpoints defaults
    // ----------------------------------------------------------------------------
    // Basic
    var defaults = {
        dataType: 'json',
        timeout: 5000,
        headers: {}
      };
    // Headers
    defaults.headers = { 'Content-Type': 'application/json' };
    // ----------------------------------------------------------------------------
    // Endpoints module
    //
    // Module for creating client side APIs
    //
    // - Normalizes interface for passing data to various methods (GET, POST, DEL)
    // - Provides defaults for api.
    // ----------------------------------------------------------------------------
    var Endpoints = function (ajax, opts) {
      var decorators = opts.decorators || {}, resources = opts.resources;
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
  }(utils, resource);


module.exports = endpoints;
