/*
 * test/endpoints.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'endpoints/endpoints'
], function (assert, Endpoints) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('umd - endpoints.js', function () {

  it('Should create a new instance.', function () {
    var endpoints = new Endpoints('ajax', {
      resources: {
        user: {},
        professional: {},
        messages: {}
      },
      decorators: {
        beforeSend: function () {}
      },
      headers: {
        'Authentication': 'Basic 1'
      }
    });

    assert.isInstanceOf(endpoints, Endpoints);
  });

});


});