'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('shrink-selectors', 'CSS Renaming Tool', function() {

    var path = require('path');
    var shrinkSelectors = require('../shrink-selectors.js')();

    var R     = require('ramda');
    var find  = R.find;
    var match = R.match;

    var done = this.async();

    var hasHtmlFiles = find(match(/html$/g));
    var hasCssFiles = find(match(/css$/g));

    this.files.forEach(function(f) {

      if(!hasHtmlFiles(f.src)){
        grunt.log.error('Error: source files must have one html file at least.');
        done(false);
      }

      if(!hasCssFiles(f.src)){
        grunt.log.error('Error: source files must have one css file at least.');
        done(false);
      }

      shrinkSelectors.shrink({
        src: f.src,
        dest: f.dest
      }).then(function () {
        grunt.log.ok('CSS Selectors Shinked!');
        done();
      }, function (err) {
        grunt.log.error('Error: ', err);
        done(false);
      });

    });
  });
};