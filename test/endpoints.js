/*
 * test/endpoints.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'configuration',
  'resource',
  'endpoints'
], function (assert, sinon, Configuration, Resource, Endpoints) {


// ----------------------------------------------------------------------------
// Reusable
// ----------------------------------------------------------------------------

var ajax, resources, decorators;


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('endpoints.js', function () {

  describe('constructor', function () {

    beforeEach(function () {
      sinon.stub(Endpoints, 'Resource');
      sinon.stub(Endpoints, 'Configuration', function () {
        this.prop = 'val';
      });

      Endpoints.Configuration.prototype.set = sinon.stub();
      Endpoints.Configuration.prototype.reset = sinon.stub();

      ajax = sinon.stub();

      resources = {
        user: {},
        professional: {},
        messages: {}
      };

      decorators = {
        beforeSend: sinon.stub()
      };
    });

    afterEach(function () {
      Endpoints.Resource.restore();
      Endpoints.Configuration.restore();
    })

    it('Should call Configuration constructor passing all options excluding decorators and resources.', function () {
      var endpoints = new Endpoints(ajax, {
        resources: resources,
        decorators: decorators,
        headers: {
          'Authentication': 'Basic 1'
        }
      });

      assert.ok(Endpoints.Configuration.calledOnce);
      assert.deepEqual(Endpoints.Configuration.args[0][0], {
        headers: {
          'Authentication': 'Basic 1'
        }
      });
    });

    it('Should set methods configure and reset on instance with the context pointing to Configuration instance.', function () {
      Endpoints.Configuration.prototype.set = function () {
        assert.equal(this.prop, 'val');
      };
      Endpoints.Configuration.prototype.reset = function () {
        assert.equal(this.prop, 'val');
      };

      var endpoints = new Endpoints(ajax, {
        resources: resources,
        decorators: decorators,
        headers: {
          'Authentication': 'Basic 1'
        }
      });

      endpoints.configure();
      endpoints.reset();
    });

    it('Should call Resource constructor and attach result to instance for each resource passed.', function () {
      var endpoints = new Endpoints(ajax, {
        resources: resources,
        decorators: decorators,
        headers: {
          'Authentication': 'Basic 1'
        }
      });

      var args = Endpoints.Resource.args;
      assert.equal(args[0][0], ajax);
      assert.isInstanceOf(args[0][1], Endpoints.Configuration);
      assert.equal(args[0][2], decorators);
      assert.equal(args[0][3], resources.user);
      assert.equal(args[1][3], resources.professional);
      assert.equal(args[2][3], resources.messages);
      assert.equal(args[0][4], endpoints);
    });

  });

});


});