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
          'lodash': '../node_modules/lodash-amd/compat'
        },
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
    all: {
      src: 'dist/endpoints.js',
      objectToExport: 'endpoints',
      globalAlias: 'Endpoints',
      template: 'src/tmpls/umd.hbs',
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
  // CREATE COMMONJS VERSION IN DIST
  // --------------------------------------------------------------------------

  'nodefy': {
    all: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src/',
      dest: 'dist/common'
    }
  },


  // --------------------------------------------------------------------------
  // COPY AMD TO DIST
  // --------------------------------------------------------------------------

  'copy': {
    all: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src/',
      dest: 'dist/amd'
    }
  },


  // --------------------------------------------------------------------------
  // WATCH FILES
  // --------------------------------------------------------------------------

  'watch': {
    options: { spawn: true },
    src: {
      files: ['Gruntfile.js', 'src/**/*.js'],
      tasks: ['build'],
      options: { livereload: true }
    },
    test: {
      files: ['test/**/*'],
      options: { livereload: true }
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
grunt.registerTask('default', ['build']);
grunt.registerTask('dev', ['build', 'connect', 'watch']);
grunt.registerTask('test', ['build', 'mocha_phantomjs']);
grunt.registerTask('test-cloud', ['build', 'connect', 'saucelabs-mocha']);
grunt.registerTask('build', ['jshint:src', 'clean', 'requirejs', 'umd', 'uglify', 'nodefy', 'copy']);


};