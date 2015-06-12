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

  utils.globalRamda();

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
