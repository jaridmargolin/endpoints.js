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
  { browserName: 'opera', platform: 'WIN7' },

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
    src: [
      'Gruntfile.js',
      'src/**/*.js',
      'test/**/*.js'
    ],
    build: [
      'dist/*.js',
      '!dist/*.min.js'
    ],
    options: {
      jshintrc: '.jshintrc',
      force: true
    }
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
        name: 'endpoints',
        baseUrl: 'src',
        out: 'dist/endpoints.js',
        optimize: 'none',
        skipModuleInsertion: true,
        paths: {
          'underscore': '../bower_components/underscore/underscore'
        },
        exclude: [
          'underscore'
        ],
        onBuildWrite: function(name, path, contents) {
          return require('amdclean').clean({
            code: contents,
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
    umd: {
      src: 'dist/endpoints.js',
      objectToExport: 'endpoints',
      globalAlias: 'Endpoints',
      template: 'src/tmpls/umd.hbs',
      dest: 'dist/umd/endpoints.js',
      deps: {
        'default': ['underscore']
      }
    },
    amd: {
      src: 'dist/endpoints.js',
      objectToExport: 'endpoints',
      globalAlias: 'Endpoints',
      template: 'src/tmpls/amd.hbs',
      dest: 'dist/amd/endpoints.js',
      deps: {
        'default': ['underscore']
      }
    },
    common: {
      src: 'dist/endpoints.js',
      objectToExport: 'endpoints',
      globalAlias: 'Endpoints',
      template: 'src/tmpls/common.hbs',
      dest: 'dist/common/endpoints.js',
      deps: {
        'default': ['underscore']
      }
    },
    standalone: {
      src: 'dist/endpoints.js',
      objectToExport: 'endpoints',
      globalAlias: 'Endpoints',
      template: 'src/tmpls/standalone.hbs',
      dest: 'dist/endpoints.js',
      deps: {
        'default': ['underscore']
      }
    }
  },

  // --------------------------------------------------------------------------
  // MINIFY JS
  // --------------------------------------------------------------------------
  'uglify': {
    all: {
      expand: true,
      cwd: 'dist/',
      src: ['**/*.js'],
      dest: 'dist/',
      ext: '.min.js'
    }
  },

  // --------------------------------------------------------------------------
  // STATIC SERVER
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
        urls: ['http://127.0.0.1:9999/test/_runner.html'],
        build: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>',
        tunnelTimeout: 5,
        concurrency: 3,
        browsers: browsers,
        testname: 'endpoints'
      }
    }
  },

  // --------------------------------------------------------------------------
  // MOCHA
  // --------------------------------------------------------------------------
  'mocha_phantomjs': {
    all: ['test/_runner.html']
  }

});

// Tasks    
grunt.registerTask('default', ['jshint:src', 'clean', 'requirejs', 'umd:umd', 'umd:amd', 'umd:common', 'umd:standalone', 'uglify', 'jshint:build']);
grunt.registerTask('test-local', ['default', 'process:api:start', 'mocha_phantomjs', 'process:api:stop']);
grunt.registerTask('test', ['default', 'connect', 'saucelabs-mocha']);


};