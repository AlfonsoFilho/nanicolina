/*jshint -W030 */

var assert = require("assert");
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');

var utils = require(path.resolve('lib', 'utils.js'));
var sandbox;

chai.use(sinonChai);

beforeEach(function (done) {
  sandbox = sinon.sandbox.create();
  utils.removeDir(path.resolve('test/output'));
  done();

});

afterEach(function() {
  sandbox.restore();
});


describe('Utils lib', function () {

  it('should place ramda function on global scope', function () {
    utils.globalRamda();
    expect(map).to.not.be.undefined;
  });

  it('should remove directory', function () {

    function hasFile(_path){
      try{
        return fs.statSync(_path).isFile();
      }catch(e){ return false; }
    }

    fs.mkdirSync(path.join('test', 'output'));
    fs.writeFileSync(path.join('test', 'output', 'test.txt'), 'test.txt');

    expect(utils.removeDir('test/output')).to.be.equal(true);
    expect(hasFile(path.join('test', 'output', 'test.txt'))).to.be.equal(false);
    expect(utils.removeDir('test/output')).to.be.equal(false);
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

  it('should write file', function (done) {
    var expectedContent = 'test';
    utils.writeFile('test/output/test.txt', expectedContent, function () {
      var content = utils.readFile('test/output/test.txt');
      expect(content).to.be.equal(expectedContent);
      done();
    });

  });

  it('should get letter from number', function () {
    var BASE = 52;
    expect(utils.toRadix(0, BASE)).to.be.equal('a');
    expect(utils.toRadix(25, BASE)).to.be.equal('z');
    expect(utils.toRadix(26, BASE)).to.be.equal('A');
    expect(utils.toRadix(27, BASE)).to.be.equal('B');
    expect(utils.toRadix(52, BASE)).to.be.equal('ba');
    expect(utils.toRadix(53, BASE)).to.be.equal('bb');
    expect(utils.toRadix((52*10), BASE)).to.be.equal('ka');
    expect(utils.toRadix((52*52), BASE)).to.be.equal('baa');
  });

  it('should get object length', function () {
    expect(utils.getObjectLength({a:1, b:2})).to.be.equal(2);
  });

  it('should log message', function () {
    sandbox.stub(global.console, "log");
    utils.log('test', {test:true});
    expect(console.log).to.have.been.calledWith('test');
    sandbox.restore();
  });
});