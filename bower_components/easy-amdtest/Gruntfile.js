/*!
 * Gruntfile.js
 * 
 * Copyright (c) 2014
 */


module.exports = function (grunt) {


// Load tasks
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  
// Browsers
var browsers = [
  // Latest Versions
  { browserName: 'firefox', platform: 'WIN8' },
  { browserName: 'chrome', platform: 'WIN8' },
  // { browserName: 'opera', platform: 'WIN7' },

  // Internet Explorer
  { browserName: 'internet explorer', platform: 'WIN8', version: '10' },
  { browserName: 'internet explorer', platform: 'VISTA', version: '9' },
  { browserName: 'internet explorer', platform: 'XP', version: '8' }
];

// Config
grunt.initConfig({

  // --------------------------------------------------------------------------
  // PKG CONFIG
  // --------------------------------------------------------------------------
  'pkg': grunt.file.readJSON('package.json'),

  // --------------------------------------------------------------------------
  // JSHINT
  // --------------------------------------------------------------------------
  'jshint': {
    all: [ 'Gruntfile.js', 'src/**/*.js', 'test/*.js' ],
    options: { jshintrc: '.jshintrc', force: true }
  },

  // --------------------------------------------------------------------------
  // CLEAN (EMPTY DIRECTORY)
  // --------------------------------------------------------------------------
  'clean': ['dist'],

  // --------------------------------------------------------------------------
  // REQUIREJS BUILD
  // --------------------------------------------------------------------------
  'requirejs': {
    compile: {
      options: {
        name: 'easy-amdtest',
        baseUrl: 'src',
        out: 'dist/easy-amdtest.js',
        optimize: 'none',
        skipModuleInsertion: true,
        onBuildWrite: function(name, path, contents) {
          return require('amdclean').clean({
            code: contents,
            commentCleanName: 'amdclean-ignore',
            prefixMode: 'camelCase',
            escodegen: {
              format: {
                indent: { style: '  ' }
              }
            }
          });
        }
      }
    }
  },

  // --------------------------------------------------------------------------
  // UMD WRAP
  // --------------------------------------------------------------------------
  'umd': {
    all: {
      src: 'dist/easy-amdtest.js',
      template: 'build/wrap.hbs',
      objectToExport: 'easyAmdtest',
      globalAlias: 'EasyAMDTest',
      indent: '  '
    }
  },

  // --------------------------------------------------------------------------
  // MINIFY JS
  // --------------------------------------------------------------------------
  'uglify': {
    all: {
      src: 'dist/easy-amdtest.js',
      dest: 'dist/easy-amdtest.min.js'
    }
  },

  // --------------------------------------------------------------------------
  // SERVER
  // --------------------------------------------------------------------------
  'connect': {
    server: {
      options: { base: '', port: 9999 }
    }
  },

  // --------------------------------------------------------------------------
  // TESTS
  // --------------------------------------------------------------------------
  'saucelabs-mocha': {
    all: {
      options: {
        urls: ['http://127.0.0.1:9999/test/_runner-mocha.html'],
        build: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>',
        tunnelTimeout: 5,
        concurrency: 3,
        browsers: browsers,
        testname: 'easy-amdtest'
      }
    }
  },

  // --------------------------------------------------------------------------
  // MOCHA
  // --------------------------------------------------------------------------
  'mocha_phantomjs': {
    all: ['test/_runner-mocha.html']
  }
});

// Tasks    
grunt.registerTask('default', ['jshint', 'clean', 'requirejs', 'umd', 'uglify']);
grunt.registerTask('test-local', ['default', 'mocha_phantomjs']);
grunt.registerTask('test', ['default', 'connect', 'saucelabs-mocha']);


};