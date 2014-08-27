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
 * isNull.js
 * 
 * Copyright (c) 2014
 */
var assistIsNull, assistIsUndefined, assistJsonClone, assistSnip, utils, assistIsObject, assistIsArray, assistDeepMerge, stringspaceUtils, stringspaceStringspace, miniStoreUtils, miniStoreMiniStore, preFlightPreFlight, endpoints;
assistIsNull = function (variable) {
  return variable === null;
};
/*!
 * isUndefined.js
 * 
 * Copyright (c) 2014
 */
assistIsUndefined = function (variable) {
  return typeof variable === 'undefined';
};
/*!
 * jsonClone.js
 * 
 * Copyright (c) 2014
 */
assistJsonClone = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
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
utils = function (isNull, isUndefined, jsonClone, snip) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  // proxy already built utils
  var _ = {
    isNull: isNull,
    isUndefined: isUndefined,
    jsonClone: jsonClone,
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
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}(assistIsNull, assistIsUndefined, assistJsonClone, assistSnip);
/*!
 * isObject.js
 * 
 * Copyright (c) 2014
 */
assistIsObject = function (value) {
  return value === Object(value);
};
/*!
 * isArray.js
 * 
 * Copyright (c) 2014
 */
assistIsArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
/*!
 * deepMerge.js
 * 
 * Copyright (c) 2014
 */
assistDeepMerge = function (isArray, isObject) {
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
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
  var deepMerge = function (dest, obj) {
    for (var k in obj) {
      var destVal = dest[k] || {};
      var objVal = obj[k];
      var isObj = isObject(objVal);
      var isArr = isArray(objVal);
      if (isObj || isArr) {
        if (isObj && !isObject(destVal)) {
          dest[k] = {};
        }
        if (isArr && !isArray(destVal)) {
          dest[k] = [];
        }
        dest[k] = deepMerge(destVal, objVal);
      } else {
        dest[k] = objVal;
      }
    }
    return dest;
  };
  /* -----------------------------------------------------------------------------
   * deepMerge
   * ---------------------------------------------------------------------------*/
  return deepMerge;
}(assistIsArray, assistIsObject);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
stringspaceUtils = function (isArray, isObject, deepMerge) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    isObject: isObject,
    isArray: isArray,
    deepMerge: deepMerge
  };
}(assistIsArray, assistIsObject, assistDeepMerge);
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
        return typeof curVal !== 'object' || !deep ? obj[parts[i]] = val : obj[parts[i]] = _.deepMerge(curVal, val);
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
miniStoreUtils = function (isObject, jsonClone, Stringspace) {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var stringspace = new Stringspace(':');
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  var _ = {
    isObject: isObject,
    jsonClone: jsonClone
  };
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
  _.mix = function (dest, obj, flat) {
    for (var key in obj) {
      stringspace.set(dest, key, obj[key], !flat);
    }
    return dest;
  };
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
  _.get = function (obj, key) {
    return stringspace.get(obj, key);
  };
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
  _.set = function (obj, key, value, deep) {
    return stringspace.set(obj, key, value, deep);
  };
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
  _.remove = function (obj, key) {
    return stringspace.remove(obj, key);
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return _;
}(assistIsObject, assistJsonClone, stringspaceStringspace);
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
    this.original = _.mix({}, defaults);
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
  MiniStore.prototype.add = function (key, value, flat) {
    // Mixin with current data
    if (_.isObject(key)) {
      // Key actually is an object of key value pairs
      // and value is the flat flag (by default mix is deep).
      _.mix(this.data, key, value);
    } else {
      _.set(this.data, key, value);
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
    this.data = _.jsonClone(this.original);
  };
  /**
   * Get value from store.
   *
   * @example
   * store.get('key');
   *
   * @public
   * 
   * @param {string} name - String representation of key to return
   * from store. If no key is passed, the entire data object will
   * be returned.
   * @returns {*} - queried value.
   */
  MiniStore.prototype.get = function (name) {
    return name ? _.get(this.data, name) : this.data;
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
  var type = options.type;
  if ((type === 'POST' || type === 'PUT') && options.data) {
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
    options = _.jsonClone(options);
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
    var params = endpoint.params;
    // should work even if data is empty
    data = data || {};
    // validate
    this._hasRequired(params, data);
    this._isValid(params, data);
    // temp store used for manipulating options
    var processed = new MiniStore(this.defaults.get());
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
  Endpoints.prototype._getResource = function (path) {
    var resource = this.resources.get(path);
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
    var id = this.store.get('client_id');
    var secret = this.store.get('client_secret');
    var encoded = window.btoa(id + ':' + secret);
    return 'Basic ' + encoded;
  };
  /**
   * Return HTTP Bearer Auth Header.
   *
   * @private
   */
  Endpoints.prototype._authBearer = function () {
    var token = this.store.get('access_token');
    return 'Bearer ' + token;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return Endpoints;
}(utils, miniStoreMiniStore, preFlightPreFlight);

return endpoints;


}));