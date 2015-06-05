/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

var shrinkSelectors = require(path.resolve('shrink-selectors.js'))();
var utils = require(path.resolve('lib', 'utils.js'));

var fixturesPath = path.resolve('test', 'fixtures');
var expectedPath = path.resolve('test', 'expected');
var outputPath = path.resolve('output', 'test', 'fixtures');


beforeEach(function (done) {
  utils.removeDir(path.resolve('test/output'));
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

    expect(shrinkSelectors._createTolken({src: ['test/fixtures/test.css']})).to.be.deep.equal(expectedTolkenMap);
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

  it.skip('should mangle selectors', function () {

    shrinkSelectors.shrink({
      src: [
        'test/fixtures/a.css',
        'test/fixtures/b.css',
        'test/fixtures/a.html',
        'test/fixtures/b.html'
      ],
      dest: 'output',
      ext: '',
      exportMapTo: ''
    });

    var expectedCssA = fs.readFileSync(path.join(expectedPath, 'a.css'), {encoding: 'utf8'});
    var expectedCssB = fs.readFileSync(path.join(expectedPath, 'b.css'), {encoding: 'utf8'});
    var expectedHtmlA = fs.readFileSync(path.join(expectedPath, 'a.html'), {encoding: 'utf8'});
    var expectedHtmlB = fs.readFileSync(path.join(expectedPath, 'b.html'), {encoding: 'utf8'});

    var outputCssA = fs.readFileSync(path.join(outputPath, 'a.css'), {encoding: 'utf8'});
    var outputCssB = fs.readFileSync(path.join(outputPath, 'b.css'), {encoding: 'utf8'});
    var outputHtmlA = fs.readFileSync(path.join(outputPath, 'a.html'), {encoding: 'utf8'});
    var outputHtmlB = fs.readFileSync(path.join(outputPath, 'b.html'), {encoding: 'utf8'});

    expect(outputCssA).to.be.equal(expectedCssA);
    expect(outputCssB).to.be.equal(expectedCssB);
    expect(outputHtmlA).to.be.equal(expectedHtmlA);
    expect(outputHtmlB).to.be.equal(expectedHtmlB);

  });
});