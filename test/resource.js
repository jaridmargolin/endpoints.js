/*
 * test/resource.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'endpoints/resource'
], function (assert, sinon, Resource) {


// ----------------------------------------------------------------------------
// Reusable
// ----------------------------------------------------------------------------

var resource, ajax, configuration, decorators, resources, context;


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('resource.js', function () {

  beforeEach(function () {
    // Stub ajax so we can verify it is
    // being called with the correct arguments.
    ajax = sinon.stub();

    // Make sure we are mixing in the configuration
    // options
    configuration = {
      options: {
        url: 'http://firstopinionapp.com',
        key: 'val'
      }
    };

    // Make sure decorators are being applied.
    decorators = {
      beforeSend: sinon.stub().callsArg(0)
    };

    // Our resources to create - one for each method type.
    resourceEndpoints = {
      'get': {
        type: 'GET',
        path: '/get'
      },
      'post': {
        type: 'POST',
        path: '/post'
      },
      'del': {
        type: 'DELETE',
        path: '/delete', 
        before: function () {
          this.val++;
        }
      }
    };

    // Confirm resource before method is called with
    // the correct context.
    context = {
      val: 1
    };
  });

  describe('constructor', function () {

    beforeEach(function () {
      sinon.stub(Resource.prototype, '_create');
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);
    });

    afterEach(function () {
      Resource.prototype._create.restore();
    });

    it('Should set instance variable passed in to constructor.', function () {
      assert.equal(resource.ajax, ajax);
      assert.equal(resource.configuration, configuration);
      assert.equal(resource.decorators, decorators);
      assert.equal(resource.context, context);
    });

    it('Should call _create for each resource passed.', function () {
      assert.equal(Resource.prototype._create.callCount, 3);
    });

  });

  describe('resource', function () {

    it('Should return callable fn.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      assert.isFunction(resource.get);
    });

    it('Should call ajax if returns not passed or falsy.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      resource.get({});
      assert.ok(ajax.called);
    });

    it('Should return options rather than calling ajax if returns is truthy.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      assert.isObject(resource.get({}, true));
      assert.ok(ajax.notCalled);
    });

    it('Should create url with resource path, and mixin type with defaults.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      var options = resource.get({}, true);
      // delete anonymous function so we can
      // check all other props for deep equality
      delete options.beforeSend;

      assert.deepEqual(options, {
        type: 'GET',
        url: 'http://firstopinionapp.com/get',
        key: 'val'
      });
    });

    it('Should mixin passed options.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      var options = resource.get({
        key: 'new val',
        param: 'string'
      }, true);
      // delete anonymous function so we can
      // check all other props for deep equality
      delete options.beforeSend;

      assert.deepEqual(options, {
        type: 'GET',
        url: 'http://firstopinionapp.com/get',
        key: 'new val',
        param: 'string'
      });
    });

    it('Should call before method with the correct context.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      resource.del();
      assert.equal(context.val, 2);
    });

    it('Should call corresponding ajax type.', function () {
      sinon.stub(Resource.prototype, '_GET');
      sinon.stub(Resource.prototype, '_POST');
      sinon.stub(Resource.prototype, '_DELETE');

      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      resource.get();
      resource.post();
      resource.del();
      
      assert.ok(Resource.prototype._GET.calledOnce);
      assert.ok(Resource.prototype._POST.calledOnce);
      assert.ok(Resource.prototype._DELETE.calledOnce);

      Resource.prototype._GET.restore();
      Resource.prototype._POST.restore();
      Resource.prototype._DELETE.restore();
    });

  });

  describe('GET', function () {

    it('Should add parametize data to url and remove data prop.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      var options = {
        url: configuration.options.url + '/get',
        data: {
          param1: 1,
          param2: 'string'
        }
      };

      resource._GET(options);

      assert.deepEqual(options, {
        url: 'http://firstopinionapp.com/get?param1=1&param2=string'
      });
    });

  });

  describe('POST', function () {

    it('Should change data to json string.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      var options = {
        url: configuration.options.url + '/get',
        data: {
          param1: 1,
          param2: 'string'
        }
      };

      resource._POST(options);

      assert.deepEqual(options, {
        url: 'http://firstopinionapp.com/get',
        data: '{"param1":1,"param2":"string"}'
      });
    });

  });

  describe('DELETE', function () {

    it('Should add parametize data to url and remove data prop.', function () {
      resource = new Resource(ajax, configuration, decorators, resourceEndpoints, context);

      var options = {
        url: configuration.options.url + '/get',
        data: {
          param1: 1,
          param2: 'string'
        }
      };

      resource._DELETE(options);

      assert.deepEqual(options, {
        url: 'http://firstopinionapp.com/get?param1=1&param2=string'
      });
    });

  });

});


});