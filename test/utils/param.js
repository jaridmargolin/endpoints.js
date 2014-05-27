/*
 * test/utils/param.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'endpoints/utils/param'
], function (assert, sinon, param) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('utils/param.js', function () {

  it('Should convert key value pairs to url safe param str.', function () {
    var params = { param1: 1, param2: 'value' },
        expected = 'param1=1&param2=value';

    assert.equal(param(params), expected);
  });

});


});