/*
 * test/resource.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */

define([
  'proclaim',
  'resource',
], function (assert, resource) {


//
// Test Resource class initiation
//
var testInitiation = function () {
  it('Should create callable functions for each endpoint', function () {
    
  });
  it('Should add config to instance', function () {
    
  });
};

//
// Test Resource _create method 
//
var testCreate = function () {
  it('Should return callable fn', function () {
    
  });
};

//
// Test Resource _create method 
//
var testGET = function () {
  it('Should add opts data to url', function () {
    
  });
  it('Should remove opts data', function () {
    
  });
};

//
// Test Resource _create method 
//
var testPOST = function () {
  it('Should change data obj to json string', function () {
    
  });
};

//
// Test Resource _create method 
//
var testDELETE = function () {
  it('Should add opts data to url', function () {
    
  });
  it('Should remove opts data', function () {
    
  });
};

//
// Test Resource endpoints 
//
var testEndpoints = function () {
  it('Should mix endpoint path and type into defaults', function () {
    
  });
  it('Should mixin passed opts', function () {
    
  });
  it('Should call before method if passed in endpoint', function () {
    
  });
  it('Should uptdate opts based on endpoint type', function () {
    
  });
  it('Should make ajax call with modified opts', function () {
    
  });
  it('Should return opts if getOpts passed on call', function () {
    
  });
};

// Test please
describe('resource', function () {
  describe('initiation', testInitiation);
  describe('_create', testCreate);
  describe('_GET', testGET);
  describe('_POST', testPOST);
  describe('_DELETE', testDELETE);
  describe('resource endpoint', testEndpoints);
});


});