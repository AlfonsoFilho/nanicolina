/* global */
'use strict';

module.exports = function (options) {

  var fs = require('fs');
  var path = require('path');

  var utils = require('./lib/utils.js');
  var htmlParser = require('./lib/htmlParser.js')();
  var cssParser = require('./lib/cssParser.js')();
  var tolkens = require('./lib/tolkens.js')();

  utils.globalRamda();

  var getCssFiles = filter(match(/\.css$/));
  var getHtmlFiles = filter(match(/\.html$/));
  var log = utils.log;
  var writeFiles = forEach(function (file) {
    utils.writeFile(path.join(options.dest || '', file.name), file.content);
  });


  /**
   * Create Tolken Map
   */
  var createTolken = compose( // FilesList => TolkensMap
      tolkens.getMap({}),
      join(''),
      map(utils.readFile));

  var tolkensMap = createTolken(getCssFiles(options.src));

  /**
   * CSS
   */
  var refactorCSS = compose(
    writeFiles,
    map(function (file) {
      return { name: file, content: cssParser.getRefactoredCSS(tolkensMap, utils.readFile(file)) };
    }));

  refactorCSS(getCssFiles(options.src));

  /**
   * HTML
   */
   var refactorHTML = compose(
    writeFiles,
    map(function (file) {
      return { name: file, content: htmlParser.getRefactoredHTML(tolkensMap, utils.readFile(file)) };
    }));

   refactorHTML(getHtmlFiles(options.src));

  return {

  };


};
