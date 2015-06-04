/* global */
'use strict';

module.exports = function () {

  var fs = require('fs');
  var path = require('path');

  var utils = require('./lib/utils.js');
  var htmlParser = require('./lib/htmlParser.js')();
  var cssParser = require('./lib/cssParser.js')();
  var tolkens = require('./lib/tolkens.js')();

  utils.globalRamda();

  var getCssFiles = filter(match(/\.css$/));

  var getHtmlFiles = filter(match(/\.html$/));

  var writeFiles = curry(function (dest, files) {
    return forEach(function (file) {
      utils.writeFile(path.join(dest || '', file.name), file.content);
    }, files);
  });


  // Create Tolken Map
  var createTolken = compose( // FilesList => TolkensMap
      tolkens.getMap({}),
      join(''),
      map(utils.readFile),
      getCssFiles,
      prop('src'));

  // CSS
  var refactorCSS = curry(function (tolkensMap, src, dest) {
    return compose(
      writeFiles(dest),
      map(function (file) {
        return { name: file, content: cssParser.getRefactoredCSS(tolkensMap, utils.readFile(file)) };
      }),
      getCssFiles)(src);
  });

  //HTML
  var refactorHTML = curry(function (tolkensMap, src, dest) {
    return compose(
      writeFiles(dest),
      map(function (file) {
        return { name: file, content: htmlParser.getRefactoredHTML(tolkensMap, utils.readFile(file)) };
      }),
      getHtmlFiles)(src);
  });

  var Shrink = function (options) {
    var tolkensMap = createTolken(options);
    refactorCSS(tolkensMap, options.src, options.dest);
    refactorHTML(tolkensMap, options.src, options.dest);
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
