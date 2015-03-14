var gulp = require('gulp');
var mocha = require('gulp-mocha');
var cover = require('gulp-coverage');

gulp.task('test', function() {
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

gulp.task('default', function() {
  // place code for your default task here
});