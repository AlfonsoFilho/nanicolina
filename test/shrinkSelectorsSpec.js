/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');
var Q = require('q');

chai.use(chaiAsPromised);

var shrinkSelectors = require(path.resolve('shrink-selectors.js'))();
var utils = require(path.resolve('lib', 'utils.js'))();
var removeDir = require(path.resolve('test', 'helpers.js')).removeDir;

var fixturesPath = path.resolve('test', 'fixtures');
var expectedPath = path.resolve('test', 'expected');
var outputPath = path.resolve('output', 'test', 'fixtures');


beforeEach(function (done) {
  removeDir(path.resolve('test/output'));
  done();
});

afterEach(function() {

});

describe('Shrink Selectors', function () {

  it('should create tolkens map', function () {

    var expectedTolkenMap = {
      '.content': 'a',
      '.container': 'b',
      '.hidden': 'c',
      '.is-home': 'd',
      '.row': 'e',
      '.col-xs-12': 'f',
      '.col-sm-8': 'g',
      '.col-lg-4': 'h',
      '.title': 'i',
      '.link': 'j',
      '.open': 'k',
      '.visible-xs': 'l',
      '#main': 'm',
    };

    return expect(shrinkSelectors._createTolken({src: ['test/fixtures/test.css']})).to.eventually.be.deep.equal(expectedTolkenMap);

  });

  it('should filter css files', function () {

    var srcFiles = [
      'test/fixtures/a.css',
      'test/fixtures/b.css',
      'test/fixtures/a.html',
      'test/fixtures/b.html'
    ];
    var expectedFiles = [
      'test/fixtures/a.css',
      'test/fixtures/b.css'
    ];

    expect(shrinkSelectors._getCssFiles(srcFiles)).to.be.deep.equal(expectedFiles);
  });

  it('should filter html files', function () {

    var srcFiles = [
      'test/fixtures/a.css',
      'test/fixtures/b.css',
      'test/fixtures/a.html',
      'test/fixtures/b.html'
    ];
    var expectedFiles = [
      'test/fixtures/a.html',
      'test/fixtures/b.html'
    ];

    expect(shrinkSelectors._getHtmlFiles(srcFiles)).to.be.deep.equal(expectedFiles);
  });


  it('should write files', function (done) {

    var files = [{name: 'test.txt', content: 'test'}];

    Q.all(shrinkSelectors._writeFiles('output', files)).then(function (result) {
      return Q.nfcall(fs.readFile, 'output/test.txt', {encoding: 'utf8'});
    }).then(function (content) {
      expect(content).to.be.equal('test');
      done();
    }).catch(function (err) {
      done(err);
    });

  });

  it('should refactor css files', function (done) {

    var tolkenMap = {
      '.content': 'a',
      '.container': 'b',
      '.hidden': 'c',
      '.is-home': 'd',
      '.row': 'e',
      '.col-xs-12': 'f',
      '.col-sm-8': 'g',
      '.col-lg-4': 'h',
      '.title': 'i',
      '.link': 'j',
      '.open': 'k',
      '.visible-xs': 'l',
      '#main': 'm',
    };

    var actualContent = '';

    shrinkSelectors._refactorCSS(tolkenMap, ['test/fixtures/test.css'], 'output').then(function (result) {
      return Q.nfcall(fs.readFile, 'output/test/fixtures/test.css', {encoding: 'utf8'});
    }).then(function (content) {
      actualContent = content;
      return Q.nfcall(fs.readFile, 'test/expected/test.css', {encoding: 'utf8'});
    }).then(function (content) {
      expect(actualContent).to.be.deep.equal(content);
      done();
    }).catch(function (err) {
      done(err);
    });

  });

  it('should refactor html files', function (done) {

    var tolkenMap = {
      '.content': 'a',
      '.container': 'b',
      '.hidden': 'c',
      '.is-home': 'd',
      '.row': 'e',
      '.col-xs-12': 'f',
      '.col-sm-8': 'g',
      '.col-lg-4': 'h',
      '.title': 'i',
      '.link': 'j',
      '.open': 'k',
      '.visible-xs': 'l',
      '#main': 'm',
    };

    var actualContent = '';

    shrinkSelectors._refactorHTML(tolkenMap, ['test/fixtures/test.html'], 'output').then(function (result) {
      return Q.nfcall(fs.readFile, 'output/test/fixtures/test.html', {encoding: 'utf8'});
    }).then(function (content) {
      actualContent = content;
      return Q.nfcall(fs.readFile, 'test/expected/test.html', {encoding: 'utf8'});
    }).then(function (content) {
      expect(actualContent).to.be.deep.equal(content);
      done();
    }).catch(function (err) {
      done(err);
    });

  });

  it('should mangle selectors', function (done) {

    var assertFile = function (actualFile, expectedFile) {

      var _actualContent = '';

      return Q.nfcall(fs.readFile, actualFile, {encoding: 'utf8'})
        .then(function (content) {
          _actualContent = content;
          return Q.nfcall(fs.readFile, expectedFile, {encoding: 'utf8'});
        }).then(function (content) {
          expect(_actualContent).to.be.deep.equal(content);
        });

    };

    shrinkSelectors.shrink({
      src: [
        'test/fixtures/a.css',
        'test/fixtures/b.css',
        'test/fixtures/a.html',
        'test/fixtures/b.html'
      ],
      dest: 'output',
      exportTolkens: '',
      importTolkens: ''
    }).then(function () {
      return assertFile('output/test/fixtures/a.html', 'test/expected/a.html');
    }).then(function () {
      return assertFile('output/test/fixtures/b.html', 'test/expected/b.html');
    })
    .then(function () {
      return assertFile('output/test/fixtures/a.css', 'test/expected/a.css');
    }).then(function () {
      return assertFile('output/test/fixtures/b.css', 'test/expected/b.css');
    }).then(function (content) {
      done();
    }).catch(function (err) {
      done(err);
    });

  });
});