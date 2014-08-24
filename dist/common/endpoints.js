/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

var _ = require('./utils');
var MiniStore = require('mini-store/mini-store');
var preflight = require('pre-flight/pre-flight');


/* -----------------------------------------------------------------------------
 * Endpoints
 * ---------------------------------------------------------------------------*/

/**
 * JSON configured API interface.
 *
 * @example
 * var api = new Endpoints($.ajax, options);
 *
 * @public
 * @constructor
 *
 * @param {object} ajax - $.ajax or ajax method with identical api.
 * @param {object} options - options containg defaults, credentials
 *   and resources.
 */
var Endpoints = function (ajax, options) {
  // Avoid modifying original
  options = _.clone(options);

  // allow ajax calls to be made directly through
  // the library.
  this.ajax = ajax;

  // grab resources. Need to pass at least on resource
  // or the library is useless
  this.resources = new MiniStore(_.snip(options, 'resources'));

  // store credentials. The id and secret are added
  // at initiliaztion so that they will remain even
  // after a rest.
  this.store = new MiniStore({
    'client_id'     : _.snip(options, 'client_id'),
    'client_secret' : _.snip(options, 'client_secret')
  });

  // default parameters added to every call
  this.defaults = new MiniStore(options);
};


/**
 * Return processed options.
 *
 * @example
 * api.options('GET', '/endpoint', { foo: 'bar' });
 *
 * @public
 *
 * @param {string} type - Request method name.
 * @param {string} path - Path of endpoint.
 * @param {object} data - Data for endpoint.
 */
Endpoints.prototype.options = function (type, path, data) {
  return this._options.apply(this, arguments);
};


/**
 * Request resource with process options.
 *
 * @example
 * api.request('GET', '/endpoint', { foo: 'bar' });
 *
 * @public
 *
 * @param {string} type - Request method name.
 * @param {string} path - Path of endpoint.
 * @param {object} options - $.ajax options.
 */
Endpoints.prototype.request = function (type, path, options) {
  // Avoid manipulating original
  options = _.clone(options);

  // Get processed
  var processed = this._options(type, path, _.snip(options, 'data'));

  // Merging process with options allows for
  // response handlers to be applied.
  return this.ajax(_.merge(processed, options));
};


/**
 * Return processed options.
 *
 * @private
 *
 * @param {string} type - Request method name.
 * @param {string} path - Path of endpoint.
 * @param {object} data - Data for endpoint.
 */
Endpoints.prototype._options = function (type, path, data) {
  var resource = this._getResource(path);
  var endpoint = this._getEndpoint(path, resource, type);
  var params   = endpoint.params;

  // should work even if data is empty
  data = data || {};

  // validate
  this._hasRequired(params, data);
  this._isValid(params, data);

  // temp store used for manipulating options
  var options = new MiniStore(this.defaults.data);

  // create
  var url = options.data['url'] + path;
  var authHeader = this['_auth' + endpoint.authorization]();

  // populate options
  options.add('url', url);
  options.add('type', type);
  options.add('data', data);
  options.add('headers', endpoint.headers);
  options.add('headers:Authorization', authHeader);

  return preflight(options.data);
};


/**
 * Get resource with specified path and throw a
 * ReferenceError if it does not exist.
 *
 * @private
 *
 * @param {string} path - Path of endpoint.
 */
Endpoints.prototype._getResource = function(path) {
  var resource = this.resources.data[path];
  if (!resource) {
    throw new ReferenceError('No resource exists at `' + path + '`.');
  }

  return resource;
};


/**
 * Get endpoint of the specified resource with the given
 * request type and throw a ReferenceError if it does not exist.
 *
 * @private
 *
 * @param {string} path - Path of endpoint.
 * @param {object} resource - Resource JSON configuration.
 * @param {string} type - Request method name.
 */
Endpoints.prototype._getEndpoint = function(path, resource, type) {
  var endpoint = resource.options[type];
  if (!endpoint) {
    throw new ReferenceError('Resource `' + path + '` does not have a `' + type + '` endpoint.');
  }

  return endpoint;
};


/**
 * Check that data contains all required params and throw
 * Error if it does not.
 *
 * @private
 *
 * @param {object} params - Required and options params from resource
 *   configuration.
 * @param {object} data - Data object containing params to send
 *   during request.
 */
Endpoints.prototype._hasRequired = function(params, data) {
  for (var k in params) {
    var val = data[k];
    if (params[k] && (_.isUndefined(val) || _.isNull(val))) {
      throw new Error('Required param `' + k + '` missing.');
    } 
  }
};


/**
 * Check that all data keys exists in resource params and
 * throw Error if it does not.
 *
 * @private
 *
 * @param {object} params - Required and options params from resource
 *   configuration.
 * @param {object} data - Data object containing params to send
 *   during request.
 */
Endpoints.prototype._isValid = function(params, data) {
  for (var j in data) {
    if (_.isUndefined(params[j])) {
      throw new Error('The endpoint does not accept the key: `' + j + '`');
    }
  }
};


/**
 * Return HTTP Basic Auth Header.
 *
 * @private
 */
Endpoints.prototype._authBasic = function () {
  var id = this.store.data['client_id'];
  var secret = this.store.data['client_secret'];
  var encoded = window.btoa(id + ':' + secret);

  return 'Basic ' + encoded;
};


/**
 * Return HTTP Bearer Auth Header.
 *
 * @private
 */
Endpoints.prototype._authBearer = function () {
  var token = this.store.data['access_token'];

  return 'Bearer ' + token;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

module.exports = Endpoints;


