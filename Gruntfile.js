/*
 * grunt-shrink-selectors
 * https://github.com/alfonso/grunt-shrink-selectors
 *
 * Copyright (c) 2015 Alfonso Filho
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Configuration to be run (and then tested).
    'grunt-shrink-selectors': {
      default_options: {
        options: {

        },
        files: {
          'output': [
            'test/fixtures/a.html',
            'test/fixtures/b.html',
            'test/fixtures/a.css',
            'test/fixtures/b.css',
            'test/fixtures/k.css'
          ]
        }
      }
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['grunt-shrink-selectors']);

};
