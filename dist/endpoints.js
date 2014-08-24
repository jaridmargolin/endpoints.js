(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define([], function () {
      return (root.returnExportsGlobal = factory());
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like enviroments that support module.exports,
    // like Node.
    module.exports = factory();
  } else {
    root['Endpoints'] = factory();
  }
}(this, function () {

/*!
 * stringspace.js
 * 
 * Copyright (c) 2014
 */
var stringspaceUtils, stringspaceStringspace, miniStoreUtils, assistSnip, utils, miniStoreMiniStore, preFlightPreFlight, endpoints;
stringspaceUtils = function () {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  var _ = {};
  /**
   * Determine if a given value is an Object.
   *
   * @example
   * var isObj = isObject(obj);
   *
   * @public
   *
   * @param {*} value - Value to test.
   */
  _.isObject = function (value) {
    return typeof value === 'object';
  };
  /**
   * Determine if a given value is an Array.
   *
   * @example
   * var isArr = isArray(array);
   *
   * @public
   *
   * @param {*} value - Value to test.
   */
  _.isArray = function (value) {
    return Object.prototype.toString.call(value) === '[object Array]';
  };
  /**
   * Deep merge 2 objects.
   *
   * @example
   * var dest = deep(dest, objToMerge);
   *
   * @public
   *
   * @param {object} dest - Object to merge properties into.
   * @param {object} obj - Object to merge properties from.
   */
  _.deep = function (dest, obj) {
    for (var k in obj) {
      var destVal = dest[k] || {};
      var objVal = obj[k];
      var isObj = _.isObject(objVal);
      var isArr = _.isArray(objVal);
      if (isObj || isArr) {
        if (isObj && !_.isObject(destVal)) {
          dest[k] = {};
        }
        if (isArr && !_.isArray(destVal)) {
          dest[k] = [];
        }
        dest[k] = _.deep(destVal, objVal);
      } else {
        dest[k] = objVal;
      }
    }
    return dest;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}();
/*!
 * stringspace.js
 * 
 * Copyright (c) 2014
 */
stringspaceStringspace = function (_) {
  /* -----------------------------------------------------------------------------
   * Stringspace
   * ---------------------------------------------------------------------------*/
  /**
   * Utility for getting and setting stringspace properties that may
   * or may not already exist.
   *
   * @example
   * var stringspace = new Stringspace();
   *
   * @constructor
   * @public
   *
   * @param {string} seperator - Key seperator.
   */
  var Stringspace = function (seperator) {
    this.seperator = seperator || '.';
  };
  /**
   * Get an object prop by string stringspace.
   *
   * @example
   * stringspace.get(obj, 'nested:key');
   *
   * @public
   *
   * @param {object} obj - The object to retrieve data from.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   */
  Stringspace.prototype.get = function (obj, key) {
    var val;
    this._loop(obj, key, {
      last: function (obj, parts, i) {
        val = obj[parts[i]];
      },
      missing: function (obj, parts, i) {
        return false;
      }
    });
    return val;
  };
  /**
   * Set an object prop by string stringspace.
   *
   * @example
   * stringspace.set(obj, 'nested:key', 'value');
   *
   * @public
   *
   * @param {object} obj - The object to add data to.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   * @param {*} val - Value of the specified key.
   * @param {boolean} deep - Indicated if conflicts should be reserved
   *   with a deep merge or an overwrite.
   */
  Stringspace.prototype.set = function (obj, key, val, deep) {
    this._loop(obj, key, {
      last: function (obj, parts, i) {
        var curVal = obj[parts[i]];
        return typeof curVal !== 'object' || !deep ? obj[parts[i]] = val : obj[parts[i]] = _.deep(curVal, val);
      },
      missing: function (obj, parts, i) {
        obj[parts[i]] = {};
      }
    });
    return val;
  };
  /**
   * Remove value from obj
   *
   * @example
   * strspc.remove('nested');
   *
   * @public
   *
   * @param {object} obj - The object to remove value from.
   * @param {string} key - String representing the key to remove.
   */
  Stringspace.prototype.remove = function (obj, key) {
    var lastSpacer = key.lastIndexOf(':');
    var itemKey = key;
    var parent = obj;
    if (lastSpacer > 0) {
      parent = this.get(obj, key.slice(0, lastSpacer));
      itemKey = key.slice(lastSpacer + 1);
    }
    delete parent[itemKey];
  };
  /**
   * Helper method to recursively loop through object.
   *
   * @private
   *
   * @param {object} obj - The object to act on.
   * @param {string} key - Formatted string representing a key in
   *   the object.
   * @param {object} opts - Object containing methods on how to handle
   *   various situations encountered during loop.
   */
  Stringspace.prototype._loop = function (obj, key, opts) {
    var parts = key.split(this.seperator);
    for (var i = 0, len = parts.length; i < len; i++) {
      // If last stringspace - set value
      if (len === i + 1) {
        opts.last(obj, parts, i);
        return;
      }
      // If no stringspace - create & set obj to current
      if (!obj[parts[i]]) {
        if (opts.missing(obj, parts, i) === false) {
          return undefined;
        }
      }
      obj = obj[parts[i]];
    }
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return Stringspace;
}(stringspaceUtils);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
miniStoreUtils = function (Stringspace) {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var stringspace = new Stringspace(':');
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    /**
     * Clone object containing variables only. Will not work with
     * functions or undefined values.
     *
     * @example
     * cloned = clone(obj);
     *
     * @public
     *
     * @param {object} obj - Object to clone.
     */
    clone: function (obj) {
      return JSON.parse(JSON.stringify(obj));
    },
    /**
     * Loop over object keys and set on obj.
     *
     * @example
     * extend(dest, {
     *   'nested:key': 'value',
     *   'notnested': 'value'
     * });
     *
     * @public
     *
     * @param {object} dest - Object to add properties to.
     * @param {object} obj - Properties to add to dest object.
     */
    extend: function (dest, obj) {
      for (var key in obj) {
        stringspace.set(dest, key, obj[key], true);
      }
      return dest;
    },
    /**
     * Proxy stringspace.get().
     *
     * @example
     * var value = get(obj, 'nested:key');
     *
     * @public
     *
     * @param {object} dest - Object to retrieve properties from.
     * @param {string} key - Name representing key to retrieve.
     */
    get: function (obj, key) {
      return stringspace.get(obj, key);
    },
    /**
     * Proxy stringspace.set().
     *
     * @example
     * set(obj, 'nested:key', 'value');
     *
     * @public
     *
     * @param {object} obj - The object to add data to.
     * @param {string} key - Formatted string representing a key in
     *   the object.
     * @param {*} val - Value of the specified key.
     * @param {boolean} deep - Indicated if conflicts should be reserved
     *   with a deep merge or an overwrite.
     * 
     */
    set: function (obj, key, value, deep) {
      return stringspace.set(obj, key, value, deep);
    },
    /**
     * Proxy stringspace.remove().
     *
     * @example
     * remove('nested');
     *
     * @public
     *
     * @param {object} obj - The object to remove value from.
     * @param {string} key - String representing the key to remove.
     */
    remove: function (obj, key) {
      return stringspace.remove(obj, key);
    }
  };
}(stringspaceStringspace);
/*!
 * snip.js
 * 
 * Copyright (c) 2014
 */
assistSnip = function (obj, prop) {
  var val = obj[prop];
  delete obj[prop];
  return val;
};
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
utils = function (utils, snip) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  // proxy already built utils
  var _ = {
      clone: utils.clone,
      snip: snip
    };
  /**
   * Shallow merge properties from object to
   * another object.
   *
   * @example
   * dest = _.merge(dest, obj);
   *
   * @public
   *
   * @param {object} dest - Object to merge properties into.
   * @param {object} obj - Object to merge properties from.
   * @returns {object} dest - The passed destination object with
   *   properties merged.
   */
  _.merge = function (dest, obj) {
    for (var k in obj) {
      dest[k] = obj[k];
    }
    return dest;
  };
  /**
   * Return a boolean if a given variable is undefined.
   *
   * @example
   * var isUndefined = _.isUndefined(variable);
   *
   * @public
   *
   * @param {*} variable - value to check if undefined of.
   * @returns {boolean} - result of undefined check.
   */
  _.isUndefined = function (variable) {
    return typeof variable === 'undefined';
  };
  /**
   * Return a boolean if a given variable is null.
   *
   * @example
   * var isNull = _.isNull(variable);
   *
   * @public
   *
   * @param {*} variable - value to check if null of.
   * @returns {boolean} - result of null check.
   */
  _.isNull = function (variable) {
    return variable === null;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}(miniStoreUtils, assistSnip);
/*!
 * mini-store.js
 * 
 * Copyright (c) 2014
 */
miniStoreMiniStore = function (_) {
  /* -----------------------------------------------------------------------------
   * MiniStore
   * ---------------------------------------------------------------------------*/
  /**
   * Lightweight class to store and manage data.
   *
   * @example
   * var store = new MiniStore({
   *   nested: { key: 'value' }
   * });
   *
   * @public
   * @constructor
   *
   * @param {object|array} defaults - Base properties. Will remain even
   *   after calling reset. If an array of namespace keys is passed it
   *   will be converted to an object.
   */
  var MiniStore = function (defaults) {
    this.original = _.extend({}, defaults);
    // initialize by calling reset
    this.reset();
  };
  /**
   * Add properties to store data object. Will overwrite
   * if value currently exists for key. Works as a deep
   * merge.
   *
   * @example
   * store.add([
   *   { 'nested:'key': { key: 'newvalue' }
   * ]);
   *
   * @public
   *
   * @param {object|array} object - Object to merge with current data.
   * If an array of namespace keys is passed it will be converted
   * to an object.
   */
  MiniStore.prototype.add = function (key, value) {
    // If a key and value
    if (value) {
      _.set(this.data, key, value);
    } else {
      _.extend(this.data, key);
    }
    // Allow chaining
    return this;
  };
  /**
   * Remove values from store data object. If the key passed
   *   represents an object in the data object, all data within
   *   the object will be removed.
   *
   * @example
   * store.remove('nested');
   *
   * @public
   *
   * @param {string} key - Namespaced key to delete value of.
   */
  MiniStore.prototype.remove = function (key) {
    _.remove(this.data, key);
  };
  /**
   * Reset data to original data specified at the time of
   * instantiation.
   *
   * @example
   * store.reset();
   *
   * @public
   */
  MiniStore.prototype.reset = function () {
    this.data = _.clone(this.original);
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return MiniStore;
}(miniStoreUtils);
/*!
 * pre-flight.js
 * 
 * Copyright (c) 2014
 */
preFlightPreFlight = function (options) {
  if ((options.type === 'POST' || 'PUT') && options.data) {
    options.data = JSON.stringify(options.data);
  }
  return options;
};
/*!
 * endpoints.js
 * 
 * Copyright (c) 2014
 */
endpoints = function (_, MiniStore, preflight) {
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
      'client_id': _.snip(options, 'client_id'),
      'client_secret': _.snip(options, 'client_secret')
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
    var params = endpoint.params;
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
  Endpoints.prototype._getResource = function (path) {
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
  Endpoints.prototype._getEndpoint = function (path, resource, type) {
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
  Endpoints.prototype._hasRequired = function (params, data) {
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
  Endpoints.prototype._isValid = function (params, data) {
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
  return Endpoints;
}(utils, miniStoreMiniStore, preFlightPreFlight);

return endpoints;


}));