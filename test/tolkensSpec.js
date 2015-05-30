/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require("path");
var utils = require(path.resolve('lib', 'utils.js'));
var tolkens = require(path.resolve('lib', 'tolkens.js'))();

var rootPath = process.cwd();
var fixturesPath = path.join(rootPath, 'test', 'fixtures');
var expectedPath = path.join(rootPath, 'test', 'expected');

var srcCSS;

beforeEach(function () {

  srcCSS = fs.readFileSync(path.join(fixturesPath, 'test.css'), {encoding: 'utf8'});

});

afterEach(function() {

});

describe('Tolkens lib', function () {

  it('should convert class to tolken', function(){
    expect(tolkens.convert('className', 'class', {})).to.be.deep.equal({'.className': 'a'});
  });

  it('should add tolken to tolkensMap', function(){
    var tolkensMap = {};

    tolkensMap = tolkens.add('firstClass', 'class', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a'});

    tolkensMap = tolkens.add('firstClass', 'class', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a'});

    tolkensMap = tolkens.add('secondClass', 'class', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a', '.secondClass': 'b'});
  });

  it('should create tolkensMap', function(){
    var tolkensMap = {};

    var expectedObject = {
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
      '.visible-xs': 'l'
    };

    tolkensMap = tolkens.getMap({}, srcCSS);

    expect(tolkensMap).to.be.deep.equal(expectedObject);

  });
});