/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

var utils = require(path.resolve('lib', 'utils.js'));

beforeEach(function (done) {

  done();

});


describe('Utils lib', function () {

  it('should place ramda function on global scope', function () {
    utils.globalRamda();
    var teste = map(toUpper);
    expect(map).to.not.be.undefined;
  });

  it('should read file', function () {
    var content = utils.readFile('test/fixtures/b.css');
    var expected = [
      '.hide {',
      '  display: none !important;',
      '}',
      '.show {',
      '  display: block !important;',
      '}',
      '.invisible {',
      '  visibility: hidden;',
      '}',
      '.hidden {',
      '  display: none !important;',
      '  visibility: hidden !important;',
      '}',
      '.visible-xs,',
      '.visible-sm,',
      '.visible-md,',
      '.visible-lg {',
      '  display: none !important;',
      '}\n'].join('\n');

    expect(content).to.be.equal(expected);
  });

});