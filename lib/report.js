'use strict';

module.exports = function  () {

  var utils  = require('./utils.js')();
  var R      = require('ramda');
  var append = R.append;
  var length = R.length;
  var reduce = R.reduce;

  var files  = [];

  var getBytes = function (str) {
    return unescape(encodeURIComponent(String(str))).length;
  };

  var getPercentage = function (value) {
    return (value * 100).toFixed(2) + '%';
  };

  var addFile = function (filename, original, refactored, files) {

    var originalSize = length(original);
    var refactoredSize = length(refactored);

    return append({
      filename: filename,
      original: { length: originalSize, bytes: getBytes(original) },
      refactored: { length: refactoredSize, bytes: getBytes(refactored) },
      compress: utils.getDataRateSave(refactoredSize, originalSize)
    }, files);
  };

  var getSummary = reduce(function (acc, value) {

      var originalSum = {
        length: acc.original['length'] + value.original['length'],
        bytes: acc.original.bytes + value.original.bytes
      };
      var refactoredSum = {
        length: acc.refactored['length'] + value.refactored['length'],
        bytes: acc.refactored.bytes + value.refactored.bytes
      };

      return {
        original: originalSum,
        refactored: refactoredSum,
        compress: utils.getDataRateSave(refactoredSum.length, originalSum.length)
      };

    }, {
      original: { length: 0, bytes: 0 },
      refactored: { length: 0, bytes: 0 },
      compress: 0
    });

  return {
    _files: files,
    getBytes: getBytes,
    getPercentage: getPercentage,
    addFile: addFile,
    getSummary: getSummary
  };
};