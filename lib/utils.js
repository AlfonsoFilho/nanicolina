'use strict';

module.exports = function() {

  var fs = require('fs');
  var path = require('path');
  var R = require('ramda');
  var Q = require('q');

  var getObjectLength = R.compose(R.length, R.keys);

  var log = R.curry(function(message, value) {
    console.log(message, value);
    return value;
  });

  function toRadix(N, radix) {
    //http://www.javascripter.net/faq/convert3.htm?t1=toRadix%2810%2C25%29

    var HexN = '';
    var Q    = Math.floor(Math.abs(N));
    var R;

    while (true) {
      R = Q % radix;
      HexN = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(R) + HexN;
      Q = (Q - R) / radix;
      if (Q === 0) {
        break;
      }
    }

    return ((N < 0) ? '-' + HexN : HexN);
  }

  function readFile(file) {
    return Q.nfcall(fs.readFile, path.resolve(file), {encoding: 'utf8'});
  }

  function getDataRateSave(compressedData, unCompressedData) {
    return Number((1 - (compressedData / unCompressedData)).toFixed(4));
  }

  var createDir = R.tap(
      R.compose(
        R.reduce(function(acc, item) {
          acc = R.append(item, acc);
          try {
            fs.mkdirSync(path.join.apply(null, acc));
          } catch (e) {}
          return acc;
        }, []),
        R.split(path.sep),
        R.curry(path.relative)('.'),
        R.prop('dir')));

  var createFile = function(filePath, content) {
    return R.composeP(
      function(_path) {
        return Q.nfcall(fs.writeFile, path.format(_path), content);
      },
      createDir,
      path.parse)(filePath);
  };

  return {
    getObjectLength: getObjectLength,
    log: log,
    toRadix: toRadix,
    readFile: readFile,
    getDataRateSave: getDataRateSave,
    createDir: createDir,
    createFile: createFile
  };
};
