module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  var CLASS = /class=["']([a-zA-Z][a-zA-Z0-9-_][^'"]*)['"]/g;
  var NG_CLASS = /(?:ng-class|data-ng-class)=['"]{(.*)}['"]/g;

  utils.globalRamda();

  var log = utils.log;


  var getRefactoredHTML = function (tolkensMap, htmlStr) {

    var $ = cheerio.load(htmlStr, {decodeEntities: false});

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);

    var replaceClass = function(tolkenKey, index) {
      $(tolkenKey).toggleClass(tolkenKey.replace('.', '') + ' ' + tolkensValues[index]);
    };

    var replaceNgClass = function(tolkenKey, index) {
      var className = tolkenKey.replace('.', '');
      var $el = $('[data-ng-class*=\'' + className + '\'], [ng-class*=\'' + className + '\']');

      var replaceNgClassValue = compose(
          map(replace(className, tolkensValues[index])),
          split(','),
          replace(/['"{](.*)[}'"]/, '$1')
        );

      $el.each(function (index, item) {
        if(!isNil($(item).attr('ng-class'))){
          $(item).attr('ng-class', replaceNgClassValue($(item).attr('ng-class') || ''));
        }
        if(!isNil($(item).attr('data-ng-class'))){
          $(item).attr('data-ng-class', replaceNgClassValue($(item).attr('data-ng-class') || ''));
        }
      });
    };

    forEachIndexed(function (tolkenKey, index) {

      replaceClass(tolkenKey, index);
      replaceNgClass(tolkenKey, index);

    }, tolkensKeys);

    return $.html();
  };


  return {
    getRefactoredHTML: getRefactoredHTML
  };
};