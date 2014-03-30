/*!
 * frameworks.js:
 *
 * (C) 2014 First Opinion
 * MIT LICENCE
 *
 */


define([
  'mocha/test',
  'mocha/reporter'
], function (MochaTest, MochaReporter) {


// ----------------------------------------------------------------------------
// Frameworks (Expose)
// ----------------------------------------------------------------------------

 /**
 * Key value mapping for frameworks and associated Testing and
 * Reporting classes.
 */
return {
  'mocha': {
    Test: MochaTest,
    Reporter: MochaReporter
  }
};


});