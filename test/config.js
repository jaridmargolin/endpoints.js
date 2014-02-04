/*
 * test/config.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'proclaim',
  'config',
], function (assert, config) {


//
// Test Config class initiation
//
var testInitiation = function () {
  it('Should create a instance prop attr', function () {

  });
};

//
// Test Config get method
//
var testGet = function () {
  it('Should return specified property', function () {

  });
  it('Should return undefined if property does not exist', function () {

  });
};

//
// Test Config Set method
//
var testSet = function () {
  it('Should set value for specified property', function () {

  });
  it('Should create empty namespace objects if necessary', function () {

  });
};

// Test please
describe('config', function () {
  describe('initiation', testInitiation);
  describe('get', testGet);
  describe('set', testSet);
});


});