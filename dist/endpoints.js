;(function (root, factory) {

  // --------------------------------------------------------------------------
  // UMD wrapper (returnExports)
  // https://github.com/umdjs/umd/blob/master/returnExports.js
  //
  // I don't love the redundancy in how the dependencies are defined but my
  // attempt to make this DRY backfired while using the r.js optimizer.
  // Apparently the supported UMD definitions can be found here:
  // https://github.com/umdjs/umd
  //
  // Also would like to investigate implementing. Would be nice if this was
  // mixed into amdclean as an option:
  // https://github.com/alexlawrence/grunt-umd
  // --------------------------------------------------------------------------
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore'], factory);
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require('underscore'));
  } else {
    // Browser globals (root is window)
    root['endpoints'] = factory(root._);
  }
}(this, function (underscore) {var utils = function () {
        return {
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
    }();
var resource = function (_, _u_) {
        var Resource = function (endpoints, defaults, ajax) {
            for (var key in endpoints) {
                this[key] = this._create(endpoints[key]);
            }
            this.defaults = defaults;
            this.ajax = ajax;
        };
        Resource.prototype._create = function (endpoint) {
            return utils.handler(function (opts, getOpts) {
                var base = _.extend({}, this.defaults);
                base.url += endpoint.path;
                base.type = endpoint.type;
                opts = _.extend(base, opts);
                if (endpoint.before) {
                    endpoint.before(opts);
                }
                this['_' + endpoint.type](opts);
                return getOpts ? opts : this.ajax(opts);
            }, this);
        };
        Resource.prototype._GET = function (opts) {
            if (opts.data) {
                opts.url += '?' + _u_.param(opts.data);
                delete opts.data;
            }
        };
        Resource.prototype._POST = function (opts) {
            if (opts.data) {
                opts.data = JSON.stringify(opts.data);
            }
        };
        Resource.prototype._DELETE = function (opts) {
            if (opts.data) {
                opts.url += '?' + _u_.param(opts.data);
                delete opts.data;
            }
        };
        return Resource;
    }(underscore, utils);
var endpoints = function (Resource) {
        var Endpoints = function (ajax, opts) {
            for (var key in opts.resources) {
                this[key] = new Resource(opts.resources[key], opts, ajax);
            }
            delete opts.resources;
            this.defaults = opts;
        };
        return Endpoints;
    }(resource);

return endpoints;

}));