/*!
 * easy-amdtest.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */


define([
  'frameworks'
], function (frameworks) {


// ----------------------------------------------------------------------------
// EasyAMDTest Class
//
// Class for quickly and easily testing AMD modules.
// ----------------------------------------------------------------------------

/**
 * Interface for running tests on AMD compatible files.
 *
 * **Examples**:
 *
 * ```
 * var tests = new EasyAMDTest({
 *   baseUrl: '../src',
 *   paths: {
 *     'underscore': '/bower_components/underscore/underscore'
 *   }
 * });
 * ```
 *
 * @constructor
 * @public
 *
 * @param {Object} configuration - Requirejs configuration.
 */
var EasyAMDTest = function (configuration) {
  // Save configure
  this.configuration = configuration;

  // Rewrite require paths so that they solve
  // correctly when run locally
  this._configure(this._getBaseDir());
};

/**
 * Run your test suite.
 *
 * Examples:
 *
 * ```
 * new EasyAMDTest(requireConfig).run({
 *   name: 'mocha',
 *   opts: {
 *     style: 'bdd'
 *   }
 * });
 * ```
 *
 * @public
 *
 * @param {String} baseDir - The baseDir which all paths will be resolved
 * relative to.
 */
EasyAMDTest.prototype.run = function (opts) {
  // Cache this
  var self = this;

  // Create new test instance based on passed
  // parameters
  this.framework = frameworks[opts.name];
  this.test = new this.framework.Test(opts.opts);

  // Load dependencies & perform tests
  // amdclean-ignore
  require(['require', opts.name], function (require) {
    // Setup test framework if needed
    if (self.test.setup) { self.test.setup(); }

    // Use runner and report - Used for cross browser testing
    // amdclean-ignore
    require(opts.tests, function () {
      new self.framework.Reporter(self.test.run());
    });
  });
};

/**
 * Retrieve the baseDir by remove to levels from the window.location. We are
 * able to do this, because we are aware that the tests can be found at
 * test/_runner.html
 *
 * @private
 *
 * @returns {String} baseDir - The baseDir which all paths will be resolved
 * relative to.
 */
EasyAMDTest.prototype._getBaseDir = function () {
  var curURL  = window.location.href.toString(),
      curDir  = curURL.slice(0, curURL.lastIndexOf('/'));
  
  return curDir.slice(0, curDir.lastIndexOf('/'));
};

/**
 * Prepend baseDir to all paths. Necessary to correctly resolve paths when
 * run locally.
 *
 * @private
 *
 * @param {String} baseDir - The baseDir which all paths will be resolved
 * relative to.
 */
EasyAMDTest.prototype._configure = function (baseDir) {
  var paths = this.configuration.paths;
  for (var key in paths) {
    paths[key] = baseDir + paths[key];
  }

  require.config(this.configuration);
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return EasyAMDTest;


});