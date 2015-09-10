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
var utlIsNull, utlIsUndefined, utlExtend, assistSnip, childChild, utlIsObject, utlIsArray, utlCompanionDeepMerge, stringspaceUtils, stringspaceStringspace, eventEmitterEventEmitter, utlIsEmpty, miniStoreMiniStore, preFlightPreFlight, endpoints;
utlIsNull = function (variable) {
  return variable === null;
};
/*!
 * isUndefined.js
 * 
 * Copyright (c) 2014
 */
utlIsUndefined = function (variable) {
  return typeof variable === 'undefined';
};
/*!
 * extend.js
 *
 * Copyright (c) 2014
 */
utlExtend = function (dest) {
  for (var i = 1; i < arguments.length; i++) {
    for (var k in arguments[i]) {
      dest[k] = arguments[i][k];
    }
  }
  return dest;
};
/*!
 * snip.js
 */
assistSnip = function (obj, prop) {
  var val = obj[prop];
  delete obj[prop];
  return val;
};
/*!
 * test/child.js
 * 
 * Copyright (c) 2014
 */
childChild = function (Parent, protos) {
  // Our new baby :D
  var Child;
  // Child can set constructor by passing in with
  // protos.
  if (protos.hasOwnProperty('constructor')) {
    Child = protos.constructor;
  } else {
    Child = function () {
      return Parent.apply(this, arguments);
    };
  }
  // Mixin static props directly set on parent
  for (var i in Parent) {
    Child[i] = Parent[i];
  }
  // Function used to set up correct
  // prototype chain
  var Surrogate = function () {
    this.constructor = Child;
  };
  // + Surrogate
  //   - constructor (defined above in Child)
  //   - prototype (Parent)
  Surrogate.prototype = Parent.prototype;
  // + Child
  //   + prototype (Surrogate)
  //     - prototype(Parent)
  Child.prototype = new Surrogate();
  // Mixin protos
  for (var j in protos) {
    Child.prototype[j] = protos[j];
  }
  // Return class yo!
  return Child;
};
/*!
 * isObject.js
 * 
 * Copyright (c) 2014
 */
utlIsObject = function (value) {
  return value === Object(value);
};
/*!
 * isArray.js
 * 
 * Copyright (c) 2014
 */
utlIsArray = function (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
};
/*!
 * deepMerge.js
 * 
 * Copyright (c) 2014
 */
utlCompanionDeepMerge = function (isArray, isObject) {
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
}(utlIsArray, utlIsObject);
/*!
 * utils.js
 * 
 * Copyright (c) 2014
 */
stringspaceUtils = function (isObject, deepMerge) {
  /* -----------------------------------------------------------------------------
   * utils
   * ---------------------------------------------------------------------------*/
  return {
    isObject: isObject,
    deepMerge: deepMerge
  };
}(utlIsObject, utlCompanionDeepMerge);
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
    return this._get(obj, key).val;
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
  Stringspace.prototype.set = function (obj, keyStr, val, deep) {
    var result = this._get(obj, keyStr, true);
    var curVal = result.val;
    var parent = result.parent;
    var key = result.key;
    var shouldMerge = _.isObject(curVal) && deep;
    parent[key] = shouldMerge ? _.deepMerge(curVal, val) : val;
    return parent[key];
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
   * @param {string} keyStr - String representing the key to remove.
   */
  Stringspace.prototype.remove = function (obj, keyStr) {
    var result = this._get(obj, keyStr);
    var parent = result.parent;
    var key = result.key;
    delete parent[key];
  };
  /**
   * Helper method to recursively loop through object.
   *
   * @private
   *
   * @param {object} obj - The object to act on.
   * @param {string} keyStr - Formatted string representing a key in
   *   the object.
   * @param {object} create - Flag for if we should create an empty object
   *   when an undefined property is found.
   */
  Stringspace.prototype._get = function (obj, keyStr, create) {
    var parts = keyStr.split(this.seperator);
    for (var i = 0, len = parts.length; i < len; i++) {
      var key = parts[i];
      var val = obj[key];
      var isLast = len === i + 1;
      var isUndf = !val && !create;
      if (isLast || isUndf) {
        return {
          key: key,
          val: val,
          parent: obj
        };
      }
      obj = obj[key] = val || {};
    }
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return Stringspace;
}(stringspaceUtils);
/*!
 * event-emitter.js
 * 
 * Copyright (c) 2014
 */
eventEmitterEventEmitter = function () {
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var root = this;
  /* -----------------------------------------------------------------------------
   * EventEmitter
   * ---------------------------------------------------------------------------*/
  /**
   * Lightweight EventEmitter Class.
   *
   * @example
   * var emitter = new EventEmitter(settings);
   *
   * @public
   * @constructor
   */
  var EventEmitter = function () {
    this.events = {};
  };
  /**
   * Add event listener and handler to emitter isntance.
   *
   * @example
   * emitter.on('event', this.doSomething, this);
   *
   * @public
   *
   * @param {string} name - Name of event to listen for.
   * @param {function} handler - Function to call when event is triggered.
   * @param {object} context - Context in which to execute handler. 
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.on = function (name, handler, context) {
    (this.events[name] = this.events[name] || []).unshift({
      fn: handler,
      context: context || root
    });
    return this;
  };
  /**
   * Remove event lister from instance. If no arguments are passed,
   * all events will be remove from the instance. If only name is
   * passed, all handlers will be remove from the specified event.
   * If name and handler are passed, only the handler will be
   * removed from the specified event.
   *
   * @example
   * emitter.off('event');
   * // removes all handlers from `event`
   *
   * @public
   *
   * @param {string} name - Name of event to remove listener from.
   * @param {function} handler - Function handler to remove from event.
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.off = function (name, handler) {
    var subscribers = this.events[name] || [];
    var l = subscribers.length;
    // Remove all events
    if (!name) {
      this.events = {};
    } else if (!handler) {
      delete this.events[name];
    } else {
      while (l--) {
        if (subscribers[l].fn === handler) {
          subscribers.splice(l, 1);
        }
      }
    }
    return this;
  };
  /**
   * Calls handler for all event subscribers.
   *
   * @example
   * emitter.trigger('event');
   * // removes all handlers from `event`
   *
   * @public
   *
   * @param {string} name - Name of event to remove listener from.
   *
   * @returns emitter instance (allows chaining).
   */
  EventEmitter.prototype.trigger = function (name) {
    var args = Array.prototype.slice.call(arguments, 1);
    var subscribers = this.events[name] || [];
    var l = subscribers.length;
    // fixes bug where handler could be called twice when handler
    // is responsible for moving event handlers. Now all handlers will
    // execute, regardless if they are removed during another handler.
    var copy = [];
    for (var i = 0; i < l; i++) {
      copy.push(subscribers[i]);
    }
    while (l--) {
      copy[l].fn.apply(copy[l].context, args);
    }
    return this;
  };
  /* -----------------------------------------------------------------------------
   * export
   * ---------------------------------------------------------------------------*/
  return EventEmitter;
}();
/*!
 * isEmpty.js
 * 
 * Copyright (c) 2014
 */
utlIsEmpty = function (isArray) {
  /* -----------------------------------------------------------------------------
   * isEmpty
   * ---------------------------------------------------------------------------*/
  /**
   * Determine if an object or array is empty.
   *
   * @example
   * var empty = isEmpty({});
   * // true
   *
   * @public
   *
   * @param {object} obj - obj to run isEmpty test on
   * @reutns {boolean} - true if object is empty. false if not.
   */
  return function (obj) {
    // Array
    if (isArray(obj)) {
      return obj.length === 0;
    }
    // Object
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return true;
  };
}(utlIsArray);
/*!
 * mini-store.js
 */
miniStoreMiniStore = function (require) {
  /* -----------------------------------------------------------------------------
   * dependencies
   * ---------------------------------------------------------------------------*/
  var child = childChild;
  var Stringspace = stringspaceStringspace;
  var EventEmitter = eventEmitterEventEmitter;
  var isUndefined = utlIsUndefined;
  var isObject = utlIsObject;
  var isEmpty = utlIsEmpty;
  var extend = utlExtend;
  /* -----------------------------------------------------------------------------
   * scope
   * ---------------------------------------------------------------------------*/
  var stringspace = new Stringspace(':');
  /* -----------------------------------------------------------------------------
   * MiniStore
   * ---------------------------------------------------------------------------*/
  return child(EventEmitter, {
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
     *
     * @returns {object} - store instance.
     */
    constructor: function () {
      EventEmitter.prototype.constructor.apply(this, arguments);
      this.attributes = {};
      // optionally set initial state of store
      if (arguments[0]) {
        this.set.apply(this, arguments);
      }
    },
    /**
     * Add properties to on attributes object. Will overwrite if value currently
     * exists for key. Works as a deep merge.
     *
     * @example
     * store.set({
     *   'nested:key': { key: 'newvalue' }
     * }, true);
     *
     * @example
     * store.set('nested:key', 'value');
     *   'nested:'key': { key: 'newvalue' }
     * });
     *
     * @public
     *
     * @param {object} properties - Will set each key as a property to store.
     * @param {key} key - Name of key to set in store.
     * @param {*} value - Used when key name passed. Sets value of key in store.
     * @param {object} options
     * @param {boolean} options.flat - If merge should be flat rather than deep
     *   (deep by default).
     * @param {boolean} options.silent - If we should silence the change event
     *   that fires if a property is altered.
     *
     * @returns {object} - store instance.
     */
    set: function (key, value, options) {
      var isObj = isObject(key);
      if (isObj) {
        options = value;
        value = null;
      }
      // Don't blow up if options is not defined
      options = options || {};
      // these will populated the this.changed object
      if (isObj) {
        this._setProperties(key, options);
      } else {
        this._setProperty(key, value, options);
      }
      // emit events on change
      if (!options.silent && !isEmpty(this.changed)) {
        this.trigger('change', this, options);
        for (var propName in this.changed) {
          this.trigger('change:' + propName, this, this.changed[propName], options);
        }
      }
      // chaning yo!
      return this;
    },
    /**
     * Loop over object keys and set on obj.
     *
     * @example
     * store._setProperties({
     *   'nested:key': 'value',
     *   'notnested': 'value'
     * });
     *
     * @private
     *
     * @param {object} obj - Properties to set to store.
     * @param {object} options
     * @param {boolean} options.flat - If merge should be flat rather than deep
     *   (deep by default).
     * @param {boolean} options.silent - If we should silence the change event
     *   that fires if a property is altered.
     *
     * @returns {object} - store instance.
     */
    _setProperties: function (obj, options) {
      var changed = {};
      for (var key in obj) {
        this._setProperty(key, obj[key], options);
        extend(changed, this.changed);
      }
      // changed should be equivalent to each property changed
      this.changed = changed;
    },
    /**
     * Set property on attributes.
     *
     * @example
     * store._setProperty('nested:key', 'value');
     *
     * @private
     *
     * @param {string} key - Formatted string representing a key in the store.
     * @param {*} val - Value of the specified key.
     * @param {object} options
     * @param {boolean} options.flat - If merge should be flat rather than deep
     *   (deep by default).
     * @param {boolean} options.silent - If we should silence the change event
     *   that fires if a property is altered.
     *
     * @returns {object} - store instance.
     */
    _setProperty: function (key, value, options) {
      this.changed = {};
      // For now we will just fire change events for properties one level deep.
      // Long term it may be possible to listen for nested changes and fire
      // corresponding events using walker.js. Right now the barrier to implement
      // is the deepMerge inside of stringspace. We don't get notified of the
      // individual properties that change during the merge. We would need a
      // custom deep merge that either fires a callback (event) for each changed
      // property or returns a list of changed properties. In such scenario, it
      // might make sense for stringspace to implement an EventEmitter.
      var result = stringspace._get(this.attributes, key, true);
      var propName = key.split(':')[0];
      // utilize get lookup to avoid 2x recursion
      if (result.val !== value) {
        stringspace.set(result.parent, result.key, value, !options.flat);
        this.changed[propName] = this.attributes[propName];
      }
    },
    /**
     * Remove values from attributes object. If the key passed represents an
     * object in the attributes object, all data within the object will be
     * removed.
     *
     * @example
     * store.unset('nested');
     *
     * @public
     *
     * @param {string} key - Namespaced key to delete value of.
     *
     * @returns {object} - store instance.
     */
    unset: function (key, options) {
      // Don't blow up if options is not defined
      options = options || {};
      this._unsetProperty(key);
      if (!options.silent && !isEmpty(this.changed)) {
        this.trigger('change', this, options);
      }
      // chaining yo!
      return this;
    },
    /**
     * Proxy stringspace.remove().
     *
     * @example
     * store._unsetProperty('nested');
     *
     * @public
     *
     * @param {string} key - String representing the key to remove.
     *
     * @returns {object} - store instance.
     */
    _unsetProperty: function (key) {
      this.changed = {};
      var parts = key.split(':');
      var propName = parts[0];
      var result = stringspace._get(this.attributes, key, true);
      if (isUndefined(result.val)) {
        return;
      }
      stringspace.remove(result.parent, result.key);
      // We removed a nested property. This will fire a regular change event for
      // the top level property.
      if (parts[1]) {
        this.changed[propName] = this.attributes[propName];
      } else {
        this.changed[0] = key;
      }
    },
    /**
     * Get value from store.
     *
     * @example
     * store.get('key');
     *
     * @public
     *
     * @param {string} name - String representation of key to return from store.
     * If no key is passed, the entire attributes object will be returned.
     *
     * @returns {*} - queried value.
     */
    get: function (name) {
      return name ? this._getProperty(name) : this.attributes;
    },
    /**
     * Proxy stringspace.get().
     *
     * @example
     * store._getProperty('nested:key');
     *
     * @private
     *
     * @param {string} key - Name representing key to retrieve.
     *
     * @returns {*} - queried value.
     */
    _getProperty: function (key) {
      return stringspace.get(this.attributes, key);
    },
    /**
     * Trigger a method an optionally attempt to call method on class.
     *
     * @example
     * api.triggerMethod('some:event');
     * // will call onSomeEvent method if exists.
     *
     * @public
     *
     * @param {string} eventName - Name of event to trigger.
     */
    triggerMethod: function (eventName) {
      var parts = eventName.split(':');
      for (var i = 0, l = parts.length; i < l; i++) {
        parts[i] = parts[i].charAt(0).toUpperCase() + parts[i].substring(1);
      }
      var method = this['on' + parts.join('')];
      if (method) {
        method.apply(this, Array.prototype.slice.call(arguments, 1));
      }
      this.trigger.apply(this, arguments);
    }
  });
}({});
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
 */
endpoints = function (require) {
  /* -----------------------------------------------------------------------------
   * dependencies
   * ---------------------------------------------------------------------------*/
  var isNull = utlIsNull;
  var isUndefined = utlIsUndefined;
  var extend = utlExtend;
  var snip = assistSnip;
  var child = childChild;
  var MiniStore = miniStoreMiniStore;
  var preflight = preFlightPreFlight;
  /* -----------------------------------------------------------------------------
   * Endpoints
   * ---------------------------------------------------------------------------*/
  return child(MiniStore, {
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
      var params = endpoint.params;
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
    _getResource: function (path) {
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
    _getEndpoint: function (path, resource, type) {
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
    _hasRequired: function (params, data) {
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
    _isValid: function (params, data) {
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
}({});

return endpoints;


}));