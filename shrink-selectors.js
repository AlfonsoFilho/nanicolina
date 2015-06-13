/* global */
'use strict';

module.exports = function () {

  var fs = require('fs');
  var path = require('path');
  var Q = require('q');

  var utils = require('./lib/utils.js')();
  var htmlParser = require('./lib/htmlParser.js')();
  var cssParser = require('./lib/cssParser.js')();
  var tolkens = require('./lib/tolkens.js')();

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
    return composeP(
      Q.all,
      writeFiles(dest),
      Q.all,
      map(function (file) {
        return utils.readFile(file).then(function (content) {
          return { name: file, content: cssParser.getRefactoredCSS(tolkensMap, content) };
        });
      }),
      getCssFiles)(src);
  });

  //HTML
  var refactorHTML = curry(function (tolkensMap, src, dest) {
    return composeP(
      Q.all,
      writeFiles(dest),
      Q.all,
      map(function (file) {
        return utils.readFile(file).then(function (content) {
          return { name: file, content: htmlParser.getRefactoredHTML(tolkensMap, content) };
        });
      }),
      getHtmlFiles)(src);
  });

  var Shrink = function (options) {
    return createTolken(options).then(function (tolkensMap) {
      return refactorCSS(tolkensMap, options.src, options.dest)
              .then(function () {
                return refactorHTML(tolkensMap, options.src, options.dest);
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
