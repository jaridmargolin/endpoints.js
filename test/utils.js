/*
 * test/utils.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */ 

define([
  'proclaim',
  'utils',
], function (assert, utils) {


//
// Test utils handler method
//
var testHandler = function () {
  it('Should return function with correct context', function () {
    
  });
  it('Should concat handler arguments with method arguments', function () {
    
  });
};

//
// Test utils namespace get
//
var testNamespaceGet = function () {
  it('Should return specified property', function () {

  });
  it('Should return undefined if property does not exist', function () {

  });
};

//
// Test utils namespace set
//
var testNamespaceSet = function () {
  it('Should set value for specified property', function () {

  });
  it('Should create empty namespace objects if necessary', function () {

  });
};

// Test please
describe('utils', function () {
  describe('handler', testHandler);
  describe('namespace.get', testNamespaceGet);
  describe('namespace.set', testNamespaceSet);
});


});