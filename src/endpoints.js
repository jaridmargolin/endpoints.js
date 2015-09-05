/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */

define([
  './utils',
  'mini-store/mini-store',
  'pre-flight/pre-flight'
], function (_, MiniStore, preflight) {


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
 * @param {object} root - root resource.
 */
var Endpoints = function (ajax, settings) {
  // allow ajax calls to be made directly through the library.
  this.ajax = ajax;
  this.store = new MiniStore(settings);

  // useful for subclasses to add aditional functionality once instantiated.
  if (this.intialize) {
    this.intialize(settings);
  }
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
 * @param {object} options - $.ajax options.
 */
Endpoints.prototype.options = function (type, path, options) {
  return this._options(type, path, options);
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
  return this.ajax(this._options(type, path, options));
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
Endpoints.prototype._options = function (type, path, options) {
  // Avoid manipulating original
  options = _.merge({}, options);

  // Snip out specific options props for manipulation.
  var data = _.snip(options, 'data');
  var args = _.snip(options, 'args');

  // Grab our endpoint.
  var resource = this._getResource(path);
  var endpoint = this._getEndpoint(path, resource, type);
  var params   = endpoint.params;

  // should work even if data is empty
  data = data || {};

  // validate
  this._hasRequired(params, data);
  this._isValid(params, data);

  // temp store used for manipulating options
  var processed = new MiniStore(this.store.get('defaults'));

  // populate processed
  processed.add('url', processed.get('url') + path);
  processed.add('type', type);
  processed.add('data', data);
  processed.add('headers', endpoint.headers);

  // optionals
  this._addAuth(endpoint, processed);
  this._addArgs(args, processed);

  // Make sure that any passed options overwrite
  // our proccessed.
  return _.merge(preflight(processed.get()), options);
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
  var resource = this.store.get('resources:' + path);
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
 * Add any required authorization headers.
 *
 * @private
 *
 * @param {object} endpoint - Endpoint object
 * @param {object} processed - Processed options store.
 */
Endpoints.prototype._addAuth = function (endpoint, processed) {
  if (endpoint.authorization) {
    var authHeader = this['_auth' + endpoint.authorization]();

    processed.add('headers:Authorization', authHeader);
  }
};


/**
 * Concat and add args to path if supplied.
 *
 * @private
 *
 * @param {array} args - args to add to path.
 * @param {object} processed - Processed options store.
 */
Endpoints.prototype._addArgs = function (args, processed) {
  if (args) {
    var additionalPath = '/' + args.join('/');
    var url = processed.get('url') + additionalPath;

    processed.add('url', url);
  }
};


/**
 * Return HTTP Basic Auth Header.
 *
 * @private
 */
Endpoints.prototype._authBasic = function () {
  var id = this.store.get('credentials:client_id');
  var secret = this.store.get('credentials:client_secret');
  var encoded = window.btoa(id + ':' + secret);

  return 'Basic ' + encoded;
};


/**
 * Return HTTP Bearer Auth Header.
 *
 * @private
 */
Endpoints.prototype._authBearer = function () {
  var token = this.store.get('credentials:access_token');

  return 'Bearer ' + token;
};


/* -----------------------------------------------------------------------------
 * export
 * ---------------------------------------------------------------------------*/

return Endpoints;


});