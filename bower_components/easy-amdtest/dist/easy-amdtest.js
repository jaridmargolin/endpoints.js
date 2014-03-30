(function(root, factory) {
        root['EasyAMDTest'] = factory();
}(this, function() {

  /*
   * mocha/test.js:
   *
   * (C) 2014 First Opinion
   * MIT LICENCE
   *
   */
  var mochaTest = function () {
      var MochaTest = function (opts) {
        this.opts = {};
        for (var k in this._defaults) {
          this.opts[k] = this._defaults[k];
        }
        for (var j in opts) {
          this.opts[j] = opts[j];
        }
      };
      MochaTest.prototype._defaults = { style: 'bdd' };
      MochaTest.prototype.setup = function () {
        mocha.setup(this.opts.style);
        mocha.reporter('html');
      };
      MochaTest.prototype.run = function () {
        var mPhantom = window.mochaPhantomJS;
        return mPhantom ? mPhantom.run() : mocha.run();
      };
      return MochaTest;
    }();
  /*
   * mocha/reporter.js:
   *
   * (C) 2014 First Opinion
   * MIT LICENCE
   *
   */
  var mochaReporter = function () {
      var MochaReporter = function (runner) {
        var self = this;
        this.runner = runner;
        this.failed = [];
        this.runner.on('fail', function () {
          self._onFail.apply(self, arguments);
        });
        this.runner.on('end', function () {
          self._onEnd.apply(self, arguments);
        });
      };
      MochaReporter.prototype._onFail = function (test, err) {
        this.failed.push({
          name: test.title,
          result: false,
          message: err.message,
          stack: err.stack,
          titles: this._flattenTitles(test)
        });
      };
      MochaReporter.prototype._onEnd = function () {
        window.mochaResults = this.runner.stats;
        window.mochaResults.reports = this.failed;
      };
      MochaReporter.prototype._flattenTitles = function (test) {
        var titles = [];
        while (test.parent.title) {
          titles.unshift(test.parent.title);
          test = test.parent;
        }
        return titles;
      };
      return MochaReporter;
    }();
  /*
   * frameworks.js:
   *
   * (C) 2014 First Opinion
   * MIT LICENCE
   *
   */
  var frameworks = function (MochaTest, MochaReporter) {
      return {
        'mocha': {
          Test: MochaTest,
          Reporter: MochaReporter
        }
      };
    }(mochaTest, mochaReporter);
  /*
   * easy-amdtest.js:
   *
   * (C) 2014 First Opinion
   * MIT LICENCE
   *
   */
  var easyAmdtest = function (frameworks) {
      var EasyAMDTest = function (configuration) {
        this.configuration = configuration;
        this._configure(this._getBaseDir());
      };
      EasyAMDTest.prototype.run = function (opts) {
        var self = this;
        this.framework = frameworks[opts.name];
        this.test = new this.framework.Test(opts.opts);
        require([
          'require',
          opts.name
        ], function (require) {
          if (self.test.setup) {
            self.test.setup();
          }
          require(opts.tests, function () {
            new self.framework.Reporter(self.test.run());
          });
        });
      };
      EasyAMDTest.prototype._getBaseDir = function () {
        var curURL = window.location.href.toString(), curDir = curURL.slice(0, curURL.lastIndexOf('/'));
        return curDir.slice(0, curDir.lastIndexOf('/'));
      };
      EasyAMDTest.prototype._configure = function (baseDir) {
        var paths = this.configuration.paths;
        for (var key in paths) {
          paths[key] = baseDir + paths[key];
        }
        require.config(this.configuration);
      };
      return EasyAMDTest;
    }(frameworks);
  

  return easyAmdtest;

}));