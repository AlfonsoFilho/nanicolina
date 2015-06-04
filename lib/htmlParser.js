module.exports = function () {

  var utils = require('./utils.js');
  var cheerio = require('cheerio');

  utils.globalRamda();


  var parser = function(htmlStr){
    return cheerio.load(htmlStr, {decodeEntities: false});
  };

  var removeDot = replace(/\./, '');

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

  var isMapStyle = compose(function(value){ return !!value; }, match(/\{(.*)\}/g));
  var isStringStyle = compose(not, match(/(\{(.*)\})|(\[(.*)\])|(\((.*)\))/g));
  //var isArrayStyle = match(/\[(.*)\]/g);

  var replaceClass = replacer(function (tolkenKey, tolkensValues) {
    return {
      selector: tolkenKey,
      attrName: 'class',
      process: function(index, attrValue){
        return replace(new RegExp(removeDot(tolkenKey), 'ig'), tolkensValues[index], attrValue);
      }
    };
  });

  var replaceMapStyle = curry(function(tolkenKey, tolkenValue, str){
    return compose(
      function (value) {
        return '{' + value.join(value.length ? ',' : '') + '}';
      },
      flatten,
      map(compose(
        function (value) {
          return value[0].replace(new RegExp(removeDot(tolkenKey), 'ig'), tolkenValue) + ':' + value[1];
        },
        split(/\:/))),
      split(/,/),
      replace(/\{|\}/g, ''))(str);
  });

  var replaceAngularClass = function(ngClass) {
    return replacer(function (tolkenKey, tolkensValues) {
      return {
        selector: '[' + ngClass + ']',
        attrName: ngClass,
        process: function(index, attrValue){
          return compose(
            ifElse(isStringStyle, replace(new RegExp(removeDot(tolkenKey), 'ig'), tolkensValues[index]), identity),
            //ifElse(isArrayStyle, identity, identity),
            ifElse(isMapStyle, replaceMapStyle(tolkenKey, tolkensValues[index]), identity))(attrValue);
        }
      };
    });
  };

  var replaceNgClass = replaceAngularClass('ng-class');
  var replaceDataNgClass = replaceAngularClass('data-ng-class');

  function getRefactoredHTML(tolkensMap, htmlStr){
    return compose(
      replaceClass(tolkensMap),
      replaceDataNgClass(tolkensMap),
      replaceNgClass(tolkensMap))(htmlStr);
  }

  return {
    removeDot: removeDot,
    parser: parser,
    isMapStyle: isMapStyle,
    isStringStyle: isStringStyle,
    replaceMapStyle: replaceMapStyle,
    replaceClass: replaceClass,
    replaceNgClass: replaceNgClass,
    replaceDataNgClass: replaceDataNgClass,
    getRefactoredHTML: getRefactoredHTML
  };
};