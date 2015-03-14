var gulp = require('gulp');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');

gulp.task('test', ['lint'], function() {
  return gulp.src('test/*Spec.js', {read:false})
    .pipe(cover.instrument({
      pattern: ['nanicolina.js', 'lib/**/*.js'],
      debugDirectory: 'coverage/debug'
    }))
    .pipe(mocha({reporter: 'spec'}))
    .pipe(cover.gather())
    .pipe(cover.format())
    .pipe(gulp.dest('coverage/reports'));
});

gulp.task('lint', function() {
  return gulp.src(['nanicolina.js', 'lib/**/*.js', 'test/*Spec.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('default', function() {
  // place code for your default task here
});