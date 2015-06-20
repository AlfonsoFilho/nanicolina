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

  it('should get length', function () {
    expect(report.getBytes('four')).to.be.equal(4);
    expect(report.getBytes('wrong')).to.not.be.equal(4);
  });

  it('should get percentage', function () {
    expect(report.getPercentage(0.5555)).to.be.equal('55.55%');
    expect(report.getPercentage(0.12345678)).to.be.equal('12.35%');
    expect(report.getPercentage(1)).to.be.equal('100.00%');
    expect(report.getPercentage(0)).to.be.equal('0.00%');
  });

  it('should list files info', function(){

    var expectedOne = [{
      filename: 'filename',
      original: { length: 7, bytes: 7 },
      refactored: { length: 1, bytes: 1 },
      compress: 0.8571
    }];

    var expectedTwo = [{
      filename: 'filename',
      original: { length: 7, bytes: 7 },
      refactored: { length: 1, bytes: 1 },
      compress: 0.8571
    },{
      filename: 'filename',
      original: { length: 5, bytes: 9 },
      refactored: { length: 1, bytes: 2 },
      compress: 0.8
    }];


    expect(report.addFile('filename', 'content', 'a', [])).to.be.deep.equal(expectedOne);
    expect(report.addFile('filename', 'ãáàâa', 'á', expectedOne)).to.be.deep.equal(expectedTwo);

  });

  it('should get compress summary', function () {
    var filesOne = [{
      filename: 'filename',
      original: { length: 7, bytes: 7 },
      refactored: { length: 1, bytes: 1 },
      compress: 0.8571
    }];
    var filesTwo = [{
      filename: 'filename',
      original: { length: 7, bytes: 7 },
      refactored: { length: 1, bytes: 1 },
      compress: 0.8571
    },{
      filename: 'filename',
      original: { length: 5, bytes: 9 },
      refactored: { length: 1, bytes: 2 },
      compress: 0.8
    }];
    var expectedOne = {
      original: { length: 7, bytes: 7 },
      refactored: { length: 1, bytes: 1 },
      compress: 0.8571
    };
    var expectedTwo = {
      original: { length: 12, bytes: 16 },
      refactored: { length: 2, bytes: 3 },
      compress: 0.8333
    };

    expect(report.getSummary(filesOne)).to.be.deep.equal(expectedOne);
    expect(report.getSummary(filesTwo)).to.be.deep.equal(expectedTwo);
  });

});