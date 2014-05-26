/*
 * test/utils/decorate.js:
 *
 * Copyright (c) 2014
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'sinon',
  'utils/decorate'
], function (assert, sinon, decorate) {


// ----------------------------------------------------------------------------
// Test
// ----------------------------------------------------------------------------

describe('utils/decorate.js', function () {

  it('Should wrap object method with passed decorator.', function () {
    var obj = {
      ref: {
        val: 1
      },
      fn: function (incr) {
        assert.equal(incr, 1);
        assert.equal(this.ref.val, 2);
      }
    };

    var decorator = function (fn, incr) {
      this.ref.val += incr;
      fn(incr);
    };

    decorate(obj, 'fn', decorator);
    decorate(obj, 'method', decorator);

    obj.fn(1);
    obj.method(1);

    assert.equal(obj.ref.val, 3);
  });

});


});