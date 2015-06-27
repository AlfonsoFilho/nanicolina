'use strict';

module.exports = function() {

  var utils  = require('./utils.js')();
  var R      = require('ramda');
  var append = R.append;
  var length = R.length;
  var reduce = R.reduce;
  var find     = R.find;
  var match    = R.match;
  var compose  = R.compose;
  var flatten  = R.flatten;
  var always   = R.always;
  var join     = R.join;
  var converge = R.converge;
  var prop     = R.prop;
  var concat   = R.concat;
  var map      = R.map;
  var prepend  = R.prepend;

  var files  = [];

  var getBytes = function(str) {
    return unescape(encodeURIComponent(String(str))).length;
  };

  var getPercentage = function(value) {
    return (value * 100).toFixed(2) + '%';
  };

  var addFile = function(filename, original, refactored, files) {

    var originalSize = length(original);
    var refactoredSize = length(refactored);

    return append({
      filename: filename,
      original: {length: originalSize, bytes: getBytes(original)},
      refactored: {length: refactoredSize, bytes: getBytes(refactored)},
      compress: utils.getDataRateSave(refactoredSize, originalSize)
    }, files);
  };

  var getSummary = reduce(function(acc, value) {

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
    original: {length: 0, bytes: 0},
    refactored: {length: 0, bytes: 0},
    compress: 0
  });

  var getReportFileSize = function(size) {
    if (size >= 1000) {
      return ((size % 1000 !== 0) ? (size / 1000).toFixed(1) : (size / 1000)) + 'kB';
    } else {
      return size + 'B';
    }
  };

  var getReportTemplate = function(_report) {
      var header = [
        '================================',
        'Shrink Selectors Report',
        '================================'
      ];
      var lineBreak = prepend(['']);
      var addMargin = map(concat('  '));

      return compose(
        join('\n'),
        addMargin,
        flatten,
        lineBreak,
        prepend(header),
        lineBreak,
        converge(function() { return arguments; },
          compose(
            map(function(item) {
              return [
                item.filename,
                '\n   ',
                String.fromCharCode(746),
                ' ',
                getReportFileSize(item.original.bytes) + ' >> ',
                getReportFileSize(item.refactored.bytes) + ' = ',
                getPercentage(item.compress)].join('');
            }),
            prop('files')),
          lineBreak,
          compose(
            function(value) {
              return [[
                'Total: ',
                getReportFileSize(value.original.bytes) + ' >> ',
                getReportFileSize(value.refactored.bytes) + ' = ',
                getPercentage(value.compress)].join('')];
            },
            prop('summary')),
          lineBreak
        )
      )(_report);

    };

  var saveReport = function(filePath, data) {
    return utils.createFile(filePath, getReportTemplate(data));
  };

  return {
    _files: files,
    getReportFileSize: getReportFileSize,
    getBytes: getBytes,
    getPercentage: getPercentage,
    addFile: addFile,
    getSummary: getSummary,
    getReportTemplate: getReportTemplate,
    saveReport: saveReport
  };
};
