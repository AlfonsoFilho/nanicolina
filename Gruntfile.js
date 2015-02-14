/*
 * grunt-nanicolina
 * https://github.com/AlfonsoFilho/grunt-nanicolina
 *
 * Copyright (c) 2015 Alfonso Filho
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'lib/*.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    nanicolina: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      },
      custom_options: {
        options: {
          separator: ': ',
          punctuation: ' !!!'
        },
        files: {
          'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123']
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          quiet: false,
        },
        src: ['test/*Spec.js']
      }
    },


    watch: {
      test: {
        options: {
          spawn: false,
        },
        files: [
          'test/**/*.js',
          'lib/**/*.js'
        ],
        tasks: ['jshint', 'test']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  // grunt.registerTask('test', ['clean', 'nanicolina', 'nodeunit']);
  grunt.registerTask('test', ['mochaTest']);


  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
