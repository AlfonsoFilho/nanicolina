module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  utils.globalRamda();


  var parser = function(htmlStr){
    return cheerio.load(htmlStr, {decodeEntities: false});
  };

  var removeDot = replace(/\./, '');

  var buildRegex = function (value) {
    return new RegExp(removeDot(value), 'ig');
  };

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
        return replace(buildRegex(tolkenKey), tolkensValues[index], attrValue);
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

          // console.log('attrValue', attrValue);
          // console.log('tolkenKey', tolkenKey);
          // console.log('tolkensValues[index]', tolkensValues[index]);

          return compose(
            utils.log('replacer:saiu'),
            ifElse(testMatch(MAP), replace(buildRegex(tolkenKey), tolkensValues[index]), identity),
            ifElse(testMatch(CLASS), replace(buildRegex(tolkenKey), tolkensValues[index]), identity),
            utils.log('replacer:entrou'))(attrValue);

          // return cond(
          //   [testMatch(CLASS), replace(buildRegex(tolkenKey), tolkensValues[index])],
          //   [testMatch(MAP), replace(buildRegex(tolkenKey), tolkensValues[index])],
          //   [testMatch(ARRAY), identity])(attrValue);
        }
      };
    });
  };

  var replaceNgClass = replaceAngularClass('ng-class');
  var replaceDataNgClass = replaceAngularClass('data-ng-class');

  function getRefactoredHTML(tolkensMap, htmlStr){
    return compose(
      utils.log('getRefactoredHTML:saiu'),
      replaceClass(tolkensMap),
      replaceDataNgClass(tolkensMap),
      replaceNgClass(tolkensMap),
      utils.log('getRefactoredHTML:entrou'))(htmlStr);
  }

  return {
    removeDot: removeDot,
    replaceClass: replaceClass,
    replaceNgClass: replaceNgClass,
    replaceDataNgClass: replaceDataNgClass,
    parser: parser,
    getRefactoredHTML: getRefactoredHTML
  };
};