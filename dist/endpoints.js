;(function (name, context, definition) {
  if (typeof module !== 'undefined' && module.exports) { module.exports = definition(); }
  else if (typeof define === 'function' && define.amd) { define(['jquery'], definition); }
  else { context[name] = definition(); }
})('endpoints', this, function (jquery) {

var utils = function () {
        return {
            handler: function (method, params, context) {
                return function () {
                    return Object.prototype.toString.call(params) !== '[object Array]' ? method.apply(params, arguments) : method.apply(context, params.concat(Array.prototype.slice.call(arguments)));
                };
            }
        };
    }();
var resource = function ($, utils) {
        var Resource = function (endpoints, config) {
            for (var key in endpoints) {
                this[key] = this._create(endpoints[key]);
            }
            this.config = config;
        };
        Resource.prototype._create = function (endpoint) {
            return utils.handler(function (opts, getOpts) {
                var base = $.extend({}, this.config.get('defaults'));
                base.url += endpoint.path;
                base.type = endpoint.type;
                opts = $.extend(base, opts);
                if (endpoint.before) {
                    endpoint.before(opts);
                }
                this['_' + endpoint.type](opts);
                return getOpts ? opts : $.ajax(opts);
            }, this);
        };
        Resource.prototype._GET = function (opts) {
            if (opts.data) {
                opts.url += '?' + $.param(opts.data);
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
                opts.url += '?' + $.param(opts.data);
                delete opts.data;
            }
        };
        return Resource;
    }(jquery, utils);
var config = function () {
        var Config = function () {
            this.attr = {};
        };
        Config.prototype.get = function (key) {
            return this._getKey(key);
        };
        Config.prototype.set = function (key, val) {
            return arguments.length == 1 ? this._attr = key : this._setKey(key, val);
        };
        Config.prototype._setKey = function (key, val) {
            var parts = key.split('.');
            for (var i = 0, len = parts.length, obj = this._attr; i < len; i++) {
                if (len == i + 1) {
                    obj[parts[i]] = val;
                    return;
                }
                if (!obj[parts[i]]) {
                    obj[parts[i]] = {};
                }
                obj = obj[parts[i]];
            }
        };
        Config.prototype._getKey = function (key) {
            var parts = key.split('.');
            for (var i = 0, len = parts.length, obj = this._attr; i < len; i++) {
                if (len == i + 1) {
                    return obj[parts[i]];
                }
                if (!obj[parts[i]]) {
                    throw new Error('Object ' + parts[i] + ' does not exist');
                }
                obj = obj[parts[i]];
            }
        };
        return Config;
    }();
var endpoints = function ($, Resource, Config) {
        var Endpoints = function (opts) {
            this.config = new Config();
            for (var key in opts.resources) {
                this[key] = new Resource(opts.resources[key], this.config);
            }
            delete opts.resources;
            this.config.set(opts);
        };
        Endpoints.prototype.authorize = function (data) {
            var auth = this.config.get('authorization'), creds = $.extend({}, auth);
            delete creds.endpoint;
            auth.endpoint($.extend(creds, data));
        };
        Endpoints.prototype.set = function (key, val) {
            this.config.set(key, val);
        };
        return Endpoints;
    }(jquery, resource, config);
return endpoints;

});