/* global */
'use strict';

module.exports = function () {

  var fs   = require('fs');
  var path = require('path');
  var Q    = require('q');

  var utils      = require('./lib/utils.js')();
  var htmlParser = require('./lib/htmlParser.js')();
  var cssParser  = require('./lib/cssParser.js')();
  var tolkens    = require('./lib/tolkens.js')();
  var report     = require('./lib/report.js')();

  var R              = require('ramda');
  var compose        = R.compose;
  var composeP       = R.composeP;
  var curry          = R.curry;
  var flatten        = R.flatten;
  var filter         = R.filter;
  var map            = R.map;
  var not            = R.not;
  var match          = R.match;
  var isNil          = R.isNil;
  var find           = R.find;
  var ifElse         = R.ifElse;
  var identity       = R.identity;
  var append         = R.append;
  var propEq         = R.propEq;
  var prop           = R.prop;
  var reduce         = R.reduce;
  var converge       = R.converge;
  var concat         = R.concat;
  var replace        = R.replace;
  var keys           = R.keys;
  var values         = R.values;
  var forEachIndexed = R.forEachIndexed;
  var join           = R.join;
  var split          = R.split;
  var always         = R.always;

  var getCssFiles = filter(match(/\.css$/));

  var getHtmlFiles = filter(match(/\.html$/));

  var writeFiles = curry(function (dest, files) {
    return map(function (file) {
      return utils.createFile(path.join(dest || '', file.name), file.content);
    }, files);
  });


  // Create Tolken Map
  var createTolken = composeP( // FilesList => TolkensMap
      tolkens.getMap({}),
      join(''),
      Q.all,
      map(utils.readFile),
      getCssFiles,
      prop('src'));

  // CSS
  var refactorCSS = curry(function (tolkensMap, src, dest) {

    var filesReport = [];

    return composeP(
      // utils.log('HTML:SAIU'),
      function() { return filesReport;},
      Q.all,
      writeFiles(dest),
      Q.all,
      map(function (file) {
        return utils.readFile(file).then(function (content) {
          var refactoredCSS = cssParser.getRefactoredCSS(tolkensMap, content);
          filesReport = report.addFile(file, content, refactoredCSS, filesReport);
          return { name: file, content: refactoredCSS };
        });
      }),
      getCssFiles)(src);
  });

  //HTML
  var refactorHTML = curry(function (tolkensMap, src, dest) {

    var filesReport = [];

    return composeP(
      // utils.log('HTML:SAIU'),
      function() { return filesReport;},
      Q.all,
      writeFiles(dest),
      Q.all,
      map(function (file) {
        return utils.readFile(file).then(function (content) {
          var refactoredHTML = htmlParser.getRefactoredHTML(tolkensMap, content);
          filesReport = report.addFile(file, content, refactoredHTML, filesReport);
          return { name: file, content: refactoredHTML };
        });
      }),
      getHtmlFiles)(src);
  });

  var Shrink = function (options) {
    return createTolken(options).then(function (tolkensMap) {

      var filesReport = [];

      return refactorCSS(tolkensMap, options.src, options.dest)
              .then(function (_report) {
                filesReport = concat(_report, filesReport);
                return refactorHTML(tolkensMap, options.src, options.dest);
              })
              .then(function (_report) {
                filesReport = concat(filesReport, _report);
                return  {
                  files: filesReport,
                  summary: report.getSummary(filesReport)
                };
              });
    });
  };

  return {
    shrink: Shrink,
    _createTolken: createTolken,
    _refactorCSS: refactorCSS,
    _refactorHTML: refactorHTML,
    _getCssFiles: getCssFiles,
    _getHtmlFiles: getHtmlFiles,
    _writeFiles: writeFiles
  };
};
