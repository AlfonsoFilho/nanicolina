/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require("path");
var htmlParser = require(path.resolve('lib', 'htmlParser.js'))();

var rootPath = process.cwd();
var fixturesPath = path.join(rootPath, 'test', 'fixtures');
var expectedPath = path.join(rootPath, 'test', 'expected');


beforeEach(function () {

});

afterEach(function() {

});


describe('HTML Parser', function () {

  it('should parse HTML into cheerio object', function(){
    expect(htmlParser.parser('<h1>Test</h1>').html).to.be.not.undefined;
    expect(htmlParser.parser('<h1>Test</h1>').html).to.be.function;
  });

  it('should remove dot from class', function(){
    expect(htmlParser.dropDot('.class')).to.be.equal('class');
  });

  it('should remove dot from class', function(){
    expect(htmlParser.dropDot('.class')).to.be.equal('class');
  });

  it('should replace class atributes', function(){
    var htmlSrc = [
      '<div class="classA"></div>',
      '<div class="classB"></div>',
      '<div class="classB classA"></div>'
    ].join();
    var expectedHtml = [
      '<div class="a"></div>',
      '<div class="b"></div>',
      '<div class="b a"></div>'
    ].join();
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.replaceClass(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace ng-class atributes', function(){
    var htmlSrc = [
      '<div ng-class="classB"></div>',
      '<div ng-class="classA classB"></div>',
      '<div ng-class="{\'classB\': test()}"></div>',
      '<div ng-class="{\'classA\': test(), \'classB\': test()}"></div>',
      '<div ng-class="[classA classB]"></div>',
      '<div ng-class="[classA]"></div>'
    ].join();
    var expectedHtml = [
      '<div ng-class="b"></div>',
      '<div ng-class="a b"></div>',
      '<div ng-class="{\'b\': test()}"></div>',
      '<div ng-class="{\'a\': test(), \'b\': test()}"></div>',
      '<div ng-class="[classA classB]"></div>',
      '<div ng-class="[classA]"></div>'
    ].join();
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.getRefactoredHTML(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace data-ng-class atributes', function(){
    var htmlSrc = [
      '<div data-ng-class="classB"></div>',
      '<div data-ng-class="classA classB"></div>',
      '<div data-ng-class="{\'classB\': test()}"></div>',
      '<div data-ng-class="{\'classA\': test(), \'classB\': test()}"></div>',
      '<div data-ng-class="[classA classB]"></div>',
      '<div data-ng-class="[classA]"></div>'
    ].join();
    var expectedHtml = [
      '<div data-ng-class="b"></div>',
      '<div data-ng-class="a b"></div>',
      '<div data-ng-class="{\'b\': test()}"></div>',
      '<div data-ng-class="{\'a\': test(), \'b\': test()}"></div>',
      '<div data-ng-class="[classA classB]"></div>',
      '<div data-ng-class="[classA]"></div>'
    ].join();
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.getRefactoredHTML(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it.skip('should replace class, ng-class and data-ng-class atributes', function(){
    var htmlSrc = [
      '<div class="classA"></div>',
      '<div class="classB"></div>',
      '<div class="classB classA"></div>',
      '<div ng-class="classB"></div>',
      '<div ng-class="{\'classB\': test()"></div>',
      '<div data-ng-class="classB" class="classA"></div>',
      '<div class="classA classB classA" data-ng-class="[classA classB]"></div>'
    ].join();
    var expectedHtml = [
      '<div class="a"></div>',
      '<div class="b"></div>',
      '<div class="b a"></div>',
      '<div ng-class="b"></div>',
      '<div ng-class="{\'b\': test()"></div>',
      '<div data-ng-class="b" class="a"></div>',
      '<div class="a b a" data-ng-class="[classA classB]"></div>'
    ].join();
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.getRefactoredHTML(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

});