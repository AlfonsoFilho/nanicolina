var gulp = require('gulp');
var mocha = require('gulp-mocha');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var istanbul = require('gulp-istanbul');


gulp.task('test', ['lint'], function(cb) {

  gulp.src(['nanicolina.js', 'lib/**/*.js'])
    .pipe(istanbul()) // Covering files
    .pipe(istanbul.hookRequire()) // Force `require` to return covered files
    .on('finish', function () {
      gulp.src('test/*Spec.js', {read:false})
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports()) // Creating the reports after tests runned
        .on('end', cb);
    });

});

gulp.task('lint', function() {
  return gulp.src(['nanicolina.js', 'lib/**/*.js', 'test/*Spec.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', function() {
  // place code for your default task here
});