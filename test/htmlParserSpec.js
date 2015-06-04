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
    expect(htmlParser.removeDot('.class')).to.be.equal('class');
  });

  it('should check if class attribute is map style', function(){
    expect(htmlParser.isMapStyle('class')).to.be.equal(false);
    expect(htmlParser.isMapStyle('class class')).to.be.equal(false);
    expect(htmlParser.isMapStyle('[class]')).to.be.equal(false);
    expect(htmlParser.isMapStyle('[class, class]')).to.be.equal(false);
    expect(htmlParser.isMapStyle('{class: test()}')).to.be.equal(true);
    expect(htmlParser.isMapStyle('{\'class\': test()}')).to.be.equal(true);
    expect(htmlParser.isMapStyle('{"class": test()}')).to.be.equal(true);
    expect(htmlParser.isMapStyle('{"class": test(), "class": test()}')).to.be.equal(true);
  });

  it('should check if class attribute is string style', function(){
    expect(htmlParser.isStringStyle('class')).to.be.equal(true);
    expect(htmlParser.isStringStyle('class class')).to.be.equal(true);
    expect(htmlParser.isStringStyle('[class]')).to.be.equal(false);
    expect(htmlParser.isStringStyle('[class, class]')).to.be.equal(false);
    expect(htmlParser.isStringStyle('{class: test()}')).to.be.equal(false);
    expect(htmlParser.isStringStyle('{\'class\': test()}')).to.be.equal(false);
    expect(htmlParser.isStringStyle('{"class": test()}')).to.be.equal(false);
    expect(htmlParser.isStringStyle('{"class": test(), "class": test()}')).to.be.equal(false);
  });

  it('should replace class from keys', function(){

    var tolkenKey = 'classA';
    var tolkenValue = 'a';

    expect(htmlParser.replaceMapStyle(tolkenKey, tolkenValue, '{classA: test()}')).to.be.equal('{a: test()}');
    expect(htmlParser.replaceMapStyle(tolkenKey, tolkenValue, '{\'classA\': test()}')).to.be.equal('{\'a\': test()}');
    expect(htmlParser.replaceMapStyle(tolkenKey, tolkenValue, '{"classA": test()}')).to.be.equal('{"a": test()}');
    expect(htmlParser.replaceMapStyle(tolkenKey, tolkenValue, '{"classA classA": test()}')).to.be.equal('{"a a": test()}');
  });

  it('should replace class atributes', function(){
    var htmlSrc = [
      '<div class="classA"></div>',
      '<div class="classB"></div>',
      '<div class="classB classA"></div>',
      '<div class="classB classA classB classA"></div>'
    ].join('');
    var expectedHtml = [
      '<div class="a"></div>',
      '<div class="b"></div>',
      '<div class="b a"></div>',
      '<div class="b a b a"></div>'
    ].join('');
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.replaceClass(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace ng-class attributes with MAP style', function () {
    var htmlSrc = [
      '<div ng-class="{\'classB\': classB()}"></div>',
      '<div ng-class="{\'classA\': test(), \'classB\': test()}"></div>'
    ].join('');
    var expectedHtml = [
      '<div ng-class="{\'b\': classB()}"></div>',
      '<div ng-class="{\'a\': test(), \'b\': test()}"></div>'
    ].join('');
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.replaceNgClass(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace ng-class atributes', function(){
    var htmlSrc = [
      '<div ng-class="classB"></div>',
      '<div ng-class="classA classB"></div>',
      '<div ng-class="{\'classB\': classB()}"></div>',
      '<div ng-class="{\'classB\': classB(\'classA\')}"></div>',
      '<div ng-class="{\'classA\': test(), \'classB\': test()}"></div>',
      '<div ng-class="[classA classB]"></div>',
      '<div ng-class="[classA]"></div>'
    ].join('');
    var expectedHtml = [
      '<div ng-class="b"></div>',
      '<div ng-class="a b"></div>',
      '<div ng-class="{\'b\': classB()}"></div>',
      '<div ng-class="{\'b\': classB(\'classA\')}"></div>',
      '<div ng-class="{\'a\': test(), \'b\': test()}"></div>',
      '<div ng-class="[classA classB]"></div>',
      '<div ng-class="[classA]"></div>'
    ].join('');
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.replaceNgClass(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace data-ng-class atributes', function(){
    var htmlSrc = [
      '<div data-ng-class="classB"></div>',
      '<div data-ng-class="classA classB classA"></div>',
      '<div data-ng-class="{\'classB\': test()}"></div>',
      '<div data-ng-class="{\'classA\': test(), \'classB\': test()}"></div>',
      '<div data-ng-class="[classA classB]"></div>',
      '<div data-ng-class="[classA]"></div>'
    ].join('');
    var expectedHtml = [
      '<div data-ng-class="b"></div>',
      '<div data-ng-class="a b a"></div>',
      '<div data-ng-class="{\'b\': test()}"></div>',
      '<div data-ng-class="{\'a\': test(), \'b\': test()}"></div>',
      '<div data-ng-class="[classA classB]"></div>',
      '<div data-ng-class="[classA]"></div>'
    ].join('');
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.replaceDataNgClass(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

  it('should replace class, ng-class and data-ng-class atributes', function(){
    var htmlSrc = [
      '<div class="classA"></div>',
      '<div class="classB"></div>',
      '<div class="classB classA"></div>',
      '<div ng-class="classB"></div>',
      '<div ng-class="{\'classB\': test()}"></div>',
      '<div data-ng-class="classB" class="classA"></div>',
      '<div class="classA classB classA" data-ng-class="[classA classB]"></div>'
    ].join('');
    var expectedHtml = [
      '<div class="a"></div>',
      '<div class="b"></div>',
      '<div class="b a"></div>',
      '<div ng-class="b"></div>',
      '<div ng-class="{\'b\': test()}"></div>',
      '<div data-ng-class="b" class="a"></div>',
      '<div class="a b a" data-ng-class="[classA classB]"></div>'
    ].join('');
    var tolkensMap = { '.classA': 'a', '.classB': 'b' };

    expect(htmlParser.getRefactoredHTML(tolkensMap, htmlSrc)).to.be.equal(expectedHtml);
  });

});