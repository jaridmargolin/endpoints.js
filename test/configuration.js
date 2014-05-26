/*
 * test/configuration.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'lodash/objects/merge',
  'configuration',
], function (assert, sinon, merge, Configuration) {


// ----------------------------------------------------------------------------
// Reusable
// ----------------------------------------------------------------------------

var defaults = {
  dataType : 'json',
  timeout  : 5000,
  headers  : {
    'Content-Type': 'application/json'
  }
};

var initOptions = {
  key: 'val'
};

var setOptions = {
  headers: {
    'Authentication': 'Basic 1'
  },
  key: 'new value'
};


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('configuration.js', function () {

  describe('constructor', function () {

    it('Should set original configuration on object.', function () {
      var configuration = new Configuration(initOptions);

      assert.deepEqual(configuration.original, merge(defaults, initOptions));
    });

    it('Should call reset in order to set options on instance.', function () {
      sinon.stub(Configuration.prototype, 'reset');

      var configuration = new Configuration();

      assert.ok(Configuration.prototype.reset.calledOnce);

      Configuration.prototype.reset.restore();
    });

  });

  describe('set', function () {

    it('Should mixin passed object to options.', function () {
      var configuration = new Configuration(initOptions);

      configuration.set(setOptions);

      assert.deepEqual(configuration.options, merge(configuration.original, setOptions));
    });

  });

  describe('reset', function () {

    it('Should reset options to original configuration value.', function () {
      var configuration = new Configuration(initOptions);

      configuration.set(setOptions);
      configuration.reset();

      assert.deepEqual(configuration.options, configuration.original);
    });

  });

});


});