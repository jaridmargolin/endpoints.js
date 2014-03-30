/*!
 * mocha/reporter.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */


define(function () {


// ----------------------------------------------------------------------------
// MochaReporter Class
//
// Class used to expose test mocha results
// ----------------------------------------------------------------------------

/**
 * Class that exposes Mocha to test results to be consumed by 3rd party applications.
 *
 * @constructor
 * @public
 *
 * @param {Runner Instance} runner - The object returned by mocha.run().
 */
var MochaReporter = function (runner) {
  // Cache this
  var self = this;

  // Save instance vars
  this.runner = runner;

  // Hold all err objects
  this.failed = [];

  this.runner.on('fail', function () {
    self._onFail.apply(self, arguments);
  });
  this.runner.on('end', function () {
    self._onEnd.apply(self, arguments);
  });
};

/**
 * Handler called when an error is raised in the runner. Pushes results to failed array store.
 *
 * @private
 *
 * @param {Object} test - test object passed by runner 'fail' event.
 * @param {Object} err - err object passed by runner 'fail' event.
 */
MochaReporter.prototype._onFail = function (test, err) {
  this.failed.push({
    name    : test.title,
    result  : false,
    message : err.message,
    stack   : err.stack,
    titles  : this._flattenTitles(test)
  });
};

/**
 * Handler called when runner completes.
 *
 * @private
 */
MochaReporter.prototype._onEnd = function () {
  window.mochaResults = this.runner.stats;
  window.mochaResults.reports = this.failed;
};

/**
 * Utility in order to array based on nested titles.
 *
 * @private
 */
MochaReporter.prototype._flattenTitles = function (test) {
  var titles = [];

  while (test.parent.title) {
    titles.unshift(test.parent.title);
    test = test.parent;
  }

  return titles;
};


// ----------------------------------------------------------------------------
// Expose
// ----------------------------------------------------------------------------
return MochaReporter;


});