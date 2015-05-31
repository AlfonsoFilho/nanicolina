module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  utils.globalRamda();


  var parser = function(htmlStr){
    return cheerio.load(htmlStr, {decodeEntities: false});
  };

  var dropDot = replace(/\./, '');

  var getAttrName = function (value) {
    return value;
  };

  var replacer = curry(function(replacerFunc, tolkensMap, htmlStr){

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);
    var $html = parser(htmlStr);

    forEachIndexed(function(tolkenKey, index){

      var selector = replacerFunc(tolkenKey);
      var attrName = replacerFunc(getAttrName);

      $html(selector).each(function (i, element) {
        var attrValue = $html(element).attr(attrName);
        $html(element).attr(attrName, replacerFunc(tolkenKey, tolkensValues, index, attrValue));
      });

    }, tolkensKeys);

    return $html.html();
  });

  var switchResult = function (tolkenKey, tolkensValues, index) {
    if (isNil(tolkensValues) || isNil(index)) {
      return (typeof(tolkenKey) === 'function') ? tolkenKey('class') : tolkenKey;
    }
    return false;
  };

  var replaceClass = replacer(function (tolkenKey, tolkensValues, index, attrValue) {
    return switchResult(tolkenKey, tolkensValues, index) || replace(dropDot(tolkenKey), tolkensValues[index], attrValue);
  });

  var replaceNgClass = replacer(function (tolkenKey, tolkensValues, index) {
    //'[data-ng-class*=\'' + dropDot(tolkenKey) + '\'], [ng-class*=\'' + dropDot(tolkenKey) + '\']'
    return ;
  });



  function getRefactoredHTML(tolkensMap, htmlStr){
    return compose(
      // utils.log('REPLACE:class'),
      replaceClass(tolkensMap)
      // utils.log('ENTROU')
      )(htmlStr);
  }

  return {
    replaceClass: replaceClass,
    parser: parser,
    getRefactoredHTML: getRefactoredHTML
  };
};