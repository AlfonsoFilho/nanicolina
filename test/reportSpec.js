/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require("path");
var utils = require(path.resolve('lib', 'utils.js'))();
var report = require(path.resolve('lib', 'report.js'))();

beforeEach(function () {

});

afterEach(function() {

});

describe('Report lib', function () {

  it('should add tolken to tolkensMap', function(){
    var expected = {
      css: [{filename: 'filename', original: 'content', refactored: 'a', compress: 0.8571}]
    };

    report.addCSS('filename', 'content', 'a');

    expect(report._state).to.be.deep.equal(expected);
  });

});