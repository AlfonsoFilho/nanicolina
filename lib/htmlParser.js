module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  utils.globalRamda();


  var parser = function(htmlStr){
    return cheerio.load(htmlStr, {decodeEntities: false});
  };

  var dropDot = replace(/\./, '');

  var replacer = curry(function(replacerFunc, tolkensMap, htmlStr){

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);
    var $html = parser(htmlStr);

    forEachIndexed(function(tolkenKey, index){

      var currentReplacer = replacerFunc(tolkenKey, tolkensValues);

      $html(currentReplacer.selector).each(function (i, element) {
        var attrValue = $html(element).attr(currentReplacer.attrName);
        $html(element).attr(currentReplacer.attrName, currentReplacer.process(index, attrValue));
      });

    }, tolkensKeys);

    return $html.html();
  });

  var replaceClass = replacer(function (tolkenKey, tolkensValues) {
    return {
      selector: tolkenKey,
      attrName: 'class',
      process: function(index, attrValue){
        return replace(dropDot(tolkenKey), tolkensValues[index], attrValue);
      }
    };
  });

  var replaceAngularClass = function(ngClass) {
    return replacer(function (tolkenKey, tolkensValues) {

      var CLASS = /["]([a-zA-Z0-9-_][^'"]*)["]/g;
      var MAP = /["][{](.*)[}]["]/g;
      var ARRAY = /["][\[]([a-zA-Z][a-zA-Z0-9-_][^\{\}'"]*)[\]]["]/g;

      var testMatch = curry(function (regex, value) {
        return match(regex, '"' + value + '"');
      });

      return {
        selector: '[' + ngClass + ']',
        attrName: ngClass,
        process: function(index, attrValue){
          return cond(
            [testMatch(CLASS), replace(dropDot(tolkenKey), tolkensValues[index])],
            [testMatch(MAP), replace(dropDot(tolkenKey), tolkensValues[index])],
            [testMatch(ARRAY), identity])(attrValue);
        }
      };
    });
  };

  var replaceNgClass = replaceAngularClass('ng-class');
  var replaceDataNgClass = replaceAngularClass('data-ng-class');

  function getRefactoredHTML(tolkensMap, htmlStr){
    return compose(
      replaceDataNgClass(tolkensMap),
      replaceNgClass(tolkensMap),
      replaceClass(tolkensMap)
      )(htmlStr);
  }

  return {
    dropDot: dropDot,
    replaceClass: replaceClass,
    parser: parser,
    getRefactoredHTML: getRefactoredHTML
  };
};