/*!
 * endpoints.js
 */




/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var isNull = require('utl/isNull');
var isUndefined = require('utl/isUndefined');
var extend = require('utl/extend');
var snip = require('assist/snip');
var child = require('child/child');
var MiniStore = require('mini-store/mini-store');
var preflight = require('pre-flight/pre-flight');


/* -----------------------------------------------------------------------------
 * Endpoints
 * ---------------------------------------------------------------------------*/

module.exports = child(MiniStore, {

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
  constructor: function (ajax, settings) {
    // allow ajax calls to be made directly through the library.
    this.ajax = ajax;

    // store inital settings
    MiniStore.prototype.constructor.call(this, settings);

    // useful for subclasses to add aditional functionality once instantiated.
    if (this.initialize) {
      this.initialize(settings);
    }
  },

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
  options: function (type, path, options) {
    return this._options(type, path, options);
  },

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
  request: function (type, path, options) {
    return this.ajax(this._options(type, path, options));
  },

  /**
   * Return processed options.
   *
   * @private
   *
   * @param {string} type - Request method name.
   * @param {string} path - Path of endpoint.
   * @param {object} data - Data for endpoint.
   */
  _options: function (type, path, options) {
    // Avoid manipulating original
    options = extend({}, options);

    // Snip out specific options props for manipulation.
    var data = snip(options, 'data');
    var args = snip(options, 'args');

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
    var processed = new MiniStore(this.get('defaults'));

    // populate processed
    processed.set('url', processed.get('url') + path);
    processed.set('type', type);
    processed.set('data', data);
    processed.set('headers', endpoint.headers);

    // optionals
    this._addAuth(endpoint, processed);
    this._addArgs(args, processed);

    // Make sure that any passed options overwrite
    // our proccessed.
    return extend(preflight(processed.get()), options);
  },

  /**
   * Get resource with specified path and throw a
   * ReferenceError if it does not exist.
   *
   * @private
   *
   * @param {string} path - Path of endpoint.
   */
  _getResource: function(path) {
    var resource = this.get('resources:' + path);
    if (!resource) {
      throw new ReferenceError('No resource exists at `' + path + '`.');
    }

    return resource;
  },

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
  _getEndpoint: function(path, resource, type) {
    var endpoint = resource.options[type];
    if (!endpoint) {
      throw new ReferenceError('Resource `' + path + '` does not have a `' + type + '` endpoint.');
    }

    return endpoint;
  },

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
  _hasRequired: function(params, data) {
    for (var k in params) {
      var val = data[k];
      if (params[k] && (isUndefined(val) || isNull(val))) {
        throw new Error('Required param `' + k + '` missing.');
      } 
    }
  },

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
  _isValid: function(params, data) {
    for (var j in data) {
      if (isUndefined(params[j])) {
        throw new Error('The endpoint does not accept the key: `' + j + '`');
      }
    }
  },

  /**
   * Add any required authorization headers.
   *
   * @private
   *
   * @param {object} endpoint - Endpoint object
   * @param {object} processed - Processed options store.
   */
  _addAuth: function (endpoint, processed) {
    if (endpoint.authorization) {
      var authHeader = this['_auth' + endpoint.authorization]();

      processed.set('headers:Authorization', authHeader);
    }
  },

  /**
   * Concat and add args to path if supplied.
   *
   * @private
   *
   * @param {array} args - args to add to path.
   * @param {object} processed - Processed options store.
   */
  _addArgs: function (args, processed) {
    if (args) {
      var additionalPath = '/' + args.join('/');
      var url = processed.get('url') + additionalPath;

      processed.set('url', url);
    }
  },

  /**
   * Return HTTP Basic Auth Header.
   *
   * @private
   */
  _authBasic: function () {
    var id = this.get('credentials:client_id');
    var secret = this.get('credentials:client_secret');
    var encoded = window.btoa(id + ':' + secret);

    return 'Basic ' + encoded;
  },

  /**
   * Return HTTP Bearer Auth Header.
   *
   * @private
   */
  _authBearer: function () {
    var token = this.get('credentials:access_token');

    return 'Bearer ' + token;
  }

});


