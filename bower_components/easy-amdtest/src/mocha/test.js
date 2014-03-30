/*!
 * mocha/test.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */


define(function () {


// ----------------------------------------------------------------------------
// MochaTest Class
//
// Configure & run mocha tests
// ----------------------------------------------------------------------------

/**
 * Interface for configuring and executing mocha tests.
 *
 * @constructor
 * @public
 *
 * @param {Object} configuration - Requirejs configuration.
 */
var MochaTest = function (opts) {
  this.opts = {};

  for (var k in this._defaults) { this.opts[k] = this._defaults[k]; }
  for (var j in opts) { this.opts[j] = opts[j]; }
};


/**
 * @private
 *
 * @property {Object} _defaults Default values for mocha tests.
 * @attribute {String} style - The style of tests for mocha to implement. 
 */
MochaTest.prototype._defaults = {
  style: 'bdd'
};


/**
 * Setup mocha tests by specifing style and reporting mechanism.
 *
 * @public
 */
MochaTest.prototype.setup = function () {
  mocha.setup(this.opts.style);
  mocha.reporter('html');
};


/**
 * Run Mocha tests. Decides wether or not to use phantom implementation.
 *
 * @public
 */
MochaTest.prototype.run = function () {
  var mPhantom = window.mochaPhantomJS;
  return mPhantom ? mPhantom.run() : mocha.run();
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return MochaTest;


});