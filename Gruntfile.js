module.exports = function (grunt) {

// Browsers
  var browsers = [
    {
      browserName: "firefox",
      platform: "WIN8"
    },
    {
      browserName: "chrome",
      platform: "WIN8"
    },
    {
      browserName: "opera",
      platform: "WIN7"
    },
    {
      browserName: 'internet explorer',
      platform: 'WIN8',
      version: '10'
    },
    {
      browserName: 'internet explorer',
      platform: 'VISTA',
      version: '9'
    },
    {
      browserName: 'internet explorer',
      platform: 'XP',
      version: '8'
    }
  ];

  grunt.initConfig({
    // USE PKG INFO
    'pkg': grunt.file.readJSON('package.json'),

    // JSHINT
    'jshint': {
      all: [
        'Gruntfile.js',
        'src/*.js'
      ],
      options: {
        force: true,
        // Bad line breaking before '?'.
        '-W014': true,
        // Expected a conditional expression and instead saw an assignment.
        '-W084': true,
        // Is better written in dot notation.
        '-W069': true
      }
    },

    // CLEAN
    'clean': ['dist'],

    // REQUIRE
    'requirejs': {
      compile: {
        options: {
          name: 'endpoints',
          baseUrl: "src",
          out: 'dist/endpoints.js',
          optimize: 'none',
          skipModuleInsertion: true,
          onBuildWrite: function(name, path, contents) {
            return require('amdclean').clean(contents);
          },
          paths: {
            'underscore': '../libs/underscore/underscore'
          },
          wrap: {
            startFile: ['src/tmpls/intro.js'],
            endFile: ['src/tmpls/outro.js']
          },
          exclude: [
            'underscore'
          ]
        }
      }
    },

    // MINIFY JS
    'uglify': {
      all: {
        src: 'dist/endpoints.js',
        dest: 'dist/endpoints.min.js'
      }
    },

    // Server
    'connect': {
      server: {
        options: {
          base: "",
          port: 9999
        }
      }
    },

    'saucelabs-mocha': {
      all: {
        options: {
          urls: ["http://127.0.0.1:9999/test/_runner.html"],
          build: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>',
          tunnelTimeout: 5,
          concurrency: 3,
          browsers: browsers,
          testname: "endpoints"
        }
      }
    }
  });

  // Load plugins
  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-saucelabs');


  // Tasks    
  grunt.registerTask('default', ['jshint', 'clean', 'requirejs', 'uglify']);
  grunt.registerTask('test', ['connect', 'saucelabs-mocha']);

};
