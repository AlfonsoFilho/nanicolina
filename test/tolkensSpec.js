/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require("path");
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

  it('should convert selector(class and id) to tolken', function(){
    expect(tolkens.convert('.className', {})).to.be.deep.equal({'.className': 'a'});
    expect(tolkens.convert('#idName', {})).to.be.deep.equal({'#idName': 'a'});
  });

  it('should add tolken to tolkensMap', function(){
    var tolkensMap = {};

    tolkensMap = tolkens.add('.firstClass', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a'});

    tolkensMap = tolkens.add('.firstClass', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a'});

    tolkensMap = tolkens.add('.secondClass', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a', '.secondClass': 'b'});

    tolkensMap = tolkens.add('#firstId', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a', '.secondClass': 'b', '#firstId': 'c'});

    tolkensMap = tolkens.add('#firstId', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a', '.secondClass': 'b', '#firstId': 'c'});

    tolkensMap = tolkens.add('#secondId', tolkensMap);
    expect(tolkensMap).to.be.deep.equal({'.firstClass': 'a', '.secondClass': 'b', '#firstId': 'c', '#secondId': 'd'});
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
      '.visible-xs': 'l',
      '#main': 'm',
    };

    tolkensMap = tolkens.getMap({}, srcCSS);

    expect(tolkensMap).to.be.deep.equal(expectedObject);

  });
});