/*!
 * test/endpoints.js
 */

define(function (require) {


/* -----------------------------------------------------------------------------
 * dependencies
 * ---------------------------------------------------------------------------*/

var $ = require('jquery');
var assert = require('proclaim');
var sinon = require('sinon');
var MiniStore = require('mini-store/mini-store');
var resources = require('fixtures/resources');
var Endpoints = require('endpoints');


/* -----------------------------------------------------------------------------
 * reusable
 * ---------------------------------------------------------------------------*/

var options = {
  'defaults:url': 'http://endpoints.com',
  'defaults:dataType': 'json',
  'defaults:timeout': 5000,
  'credentials:client_id': 'id',
  'credentials:client_secret': 'secret',
  'resources': resources
};

/* -----------------------------------------------------------------------------
 * test
 * ---------------------------------------------------------------------------*/

describe('endpoints.js', function () {

  beforeEach(function () {    
    this.endpoints = new Endpoints($.ajax, options);
  });


  /* ---------------------------------------------------------------------------
   * constructor
   * -------------------------------------------------------------------------*/

  describe('constructor', function () {

    it('Should set ajax on instance.', function () {
      assert.equal(this.endpoints.ajax, $.ajax);
    });

    it('Should create and set new MiniStore `store` on instance.', function () {
      assert.isInstanceOf(this.endpoints, MiniStore);
      assert.deepEqual(this.endpoints.attributes.defaults, {
        'url': 'http://endpoints.com',
        'dataType': 'json',
        'timeout': 5000
      });
      assert.deepEqual(this.endpoints.attributes.credentials, {
        'client_id': 'id',
        'client_secret': 'secret'
      });
      assert.deepEqual(this.endpoints.attributes.resources, resources);
    });

    it('Should call intialize if exists.', function () {
      Endpoints.prototype.initialize = function (settings) {
        this.initialized = true;
      };

      var endpoints = new Endpoints($.ajax, options);
      assert.isTrue(endpoints.initialized);

      delete Endpoints.prototype['intialize'];
    });

  });


  /* ---------------------------------------------------------------------------
   * _getResource
   * -------------------------------------------------------------------------*/

  describe('_getResource', function () {

    it('Should return resource if exists at key.', function () {
      var expected = resources['/endpoint'];

      var resource = this.endpoints._getResource('/endpoint');
      assert.deepEqual(resource, expected);
    });


    it('Should throw ReferenceError if resource does not exist.', function () {
      var self = this;
      var expected = 'No resource exists at `/error`.';

      assert.throws(function () {
        var resource = self.endpoints._getResource('/error');
      }, ReferenceError, expected);
    });

  });


  /* ---------------------------------------------------------------------------
   * _getEndpoint
   * -------------------------------------------------------------------------*/

  describe('_getEndpoint', function () {

    beforeEach(function () {
      this.path = '/endpoint';
      this.resource = this.endpoints._getResource(this.path);
    });

    it('Should throw ReferenceError if endpoint does not exist.', function () {
      var self = this;
      var expected = 'Resource `/endpoint` does not have a `GET` endpoint.';

      assert.throws(function () {
        var endpoint = self.endpoints._getEndpoint(self.path, self.resource, 'GET');
      }, ReferenceError, expected);
    });

    it('Should return endpoint if exists.', function () {
      var expected = resources['/endpoint']['options']['POST'];

      var endpoint = this.endpoints._getEndpoint(this.path, this.resource, 'POST');
      assert.deepEqual(endpoint, expected);
    });

  });


  /* ---------------------------------------------------------------------------
   * _hasRequired
   * -------------------------------------------------------------------------*/

  describe('_hasRequired', function () {

    beforeEach(function () {
      var path = '/endpoint';
      var resource = this.endpoints._getResource(path);
      var endpoint = this.endpoints._getEndpoint(path, resource, 'POST');

      this.params = endpoint['params'];
    });

    it('Should throw Error if required param is missing.', function () {
      var self = this;
      var expected = 'Required param `foo` missing.';

      assert.throws(function () {
        self.endpoints._hasRequired(self.params, {});
      }, Error, expected);
    });

    it('Should not throw Error if all required params exist.', function () {
      var self = this;

      assert.doesNotThrow(function () {
        self.endpoints._hasRequired(self.params, { 'foo': false });
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * _isValid
   * -------------------------------------------------------------------------*/

  describe('_isValid', function () {

    beforeEach(function () {
      var path = '/endpoint';
      var resource = this.endpoints._getResource(path);
      var endpoint = this.endpoints._getEndpoint(path, resource, 'POST');

      this.params = endpoint['params'];
    });

    it('Should log warning if unknown key is passed.', function () {
      var self = this;
      var expected = 'The endpoint does not accept the key: `baz`.';
      var warningSpy = sinon.spy(console, 'warn');

      self.endpoints._isValid(self.params, { 'baz': true });
      assert.isTrue(warningSpy.calledOnce);

      warningSpy.restore();
    });

    it('Should not throw Error if all keys are known.', function () {
      var self = this;

      assert.doesNotThrow(function () {
        self.endpoints._isValid(self.params, { 'bar': true });
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * _authBasic
   * -------------------------------------------------------------------------*/

  describe('_authBasic', function () {

    it('Should return value for Basic Authorization header.', function () {
      var encoded = window.btoa(options['credentials:client_id'] + ':' + options['credentials:client_secret']);
      var expected = 'Basic ' + encoded;

      assert.equal(this.endpoints._authBasic(), expected);
    });

  });


  /* ---------------------------------------------------------------------------
   * _authBearer
   * -------------------------------------------------------------------------*/

  describe('_authBearer', function () {

    it('Should return value for Bearer Authorization header.', function () {
      var token = 'token';
      var expected = 'Bearer ' + token;

      this.endpoints.set('credentials:access_token', token);
      assert.equal(this.endpoints._authBearer(), expected);
    });

  });


  /* ---------------------------------------------------------------------------
   * _options
   * -------------------------------------------------------------------------*/

  describe('_options', function () {

    beforeEach(function () {
      this.resourceSpy = sinon.spy(this.endpoints, '_getResource');
      this.endpointSpy = sinon.spy(this.endpoints, '_getEndpoint');
      this.requiredSpy = sinon.spy(this.endpoints, '_hasRequired');
      this.validSpy    = sinon.spy(this.endpoints, '_isValid');

      this.endpoints.set('credentials:access_token', 'token');
      this.options = this.endpoints._options('POST', '/endpoint', {
        args: ['foo', 'bar'],
        data: { 'foo': false }
      });
    });

    it('Should call getResource.', function () {
      assert.ok(this.resourceSpy.calledOnce);
    });

    it('Should call getEndpoint.', function () {
      assert.ok(this.endpointSpy.calledOnce);
    });

    it('Should call hasRequired.', function () {
      assert.ok(this.requiredSpy.calledOnce);
    });

    it('Should call isValid.', function () {
      assert.ok(this.validSpy.calledOnce);
    });

    it('Should return processed options object.', function () {
      assert.deepEqual(this.options, {
        'url': 'http://endpoints.com/endpoint/foo/bar',
        'type': 'POST',
        'dataType': 'json',
        'timeout': 5000,
        'headers': {
          'Accept': 'application/json;version=v1',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token'
        },
        'data': '{"foo":false}'
      });
    });

  });


  /* ---------------------------------------------------------------------------
   * options
   * -------------------------------------------------------------------------*/

  describe('options', function () {

    it('Should return options.', function () {
      var expected = this.endpoints._options('POST', '/endpoint', {
        data: { 'foo': false }
      });
      var options = this.endpoints.options('POST', '/endpoint', {
        data: { 'foo': false }
      });

      assert.deepEqual(options, expected);
    });

  });


  /* ---------------------------------------------------------------------------
   * ajax
   * -------------------------------------------------------------------------*/

  describe('request', function () {

    it('Should call ajax with prcoessed options mixed with passed options.', function () {
      var ajaxStub = sinon.stub(this.endpoints, 'ajax');

      var expected = this.endpoints.options('POST', '/endpoint', {
        data: { 'foo': false }
      });
      expected.additionalParam = true;

      this.endpoints.request('POST', '/endpoint', {
        additionalParam: true,
        data: { 'foo': false },
      });

      var options = ajaxStub.args[0][0];
      assert.deepEqual(options, expected);
    });

  });

});


});