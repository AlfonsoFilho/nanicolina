module.exports = function () {

  var utils = require('./utils.js')();
  var cheerio = require('cheerio');

  utils.globalRamda();


  var parser = function(htmlStr){
    return cheerio.load(htmlStr, {decodeEntities: false});
  };

  var removeDot = replace(/\./, '');
  var removeHash = replace(/\#/, '');

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

  var replaceID = replacer(function (tolkenKey, tolkensValues) {
    return {
      selector: tolkenKey,
      attrName: 'id',
      process: function (index, attrValue) {
        return replace(new RegExp(removeHash(tolkenKey), 'g'), tolkensValues[index], attrValue);
      }
    };
  });

  var replaceFor = replacer(function (tolkenKey, tolkensValues) {
    return {
      selector: '[for=\'' + removeHash(tolkenKey) + '\']',
      attrName: 'for',
      process: function (index, attrValue) {
        return replace(new RegExp(removeHash(tolkenKey), 'g'), tolkensValues[index], attrValue);
      }
    };
  });

  var isMapStyle = compose(function(value){ return !!value; }, match(/\{(.*)\}/g));

  var isStringStyle = compose(not, match(/(\{(.*)\})|(\[(.*)\])|(\((.*)\))/g));

  var replaceStringStyle = curry(function (tolkenKey, tolkenValue, str) {
    return compose(
          join(' '),
          map(replace(new RegExp('^' + removeDot(tolkenKey) + '$'), tolkenValue)),
          split(/\s/))(str);
  });

  var replaceMapStyle = curry(function(tolkenKey, tolkenValue, str){
    return compose(
      function (value) {
        return '{' + value.join(value.length ? ',' : '') + '}';
      },
      flatten,
      map(compose(
        function (value) {
          return value[0].replace(new RegExp(removeDot(tolkenKey), 'g'), tolkenValue) + ':' + value[1];
        },
        split(/\:/))),
      split(/,/),
      replace(/\{|\}/g, ''))(str);
  });

  var replaceClass = replacer(function (tolkenKey, tolkensValues) {
    return {
      selector: tolkenKey,
      attrName: 'class',
      process: function(index, attrValue){
        return replaceStringStyle(tolkenKey, tolkensValues[index])(attrValue);
      }
    };
  });

  var replaceAngularClass = function(ngClass) {
    return replacer(function (tolkenKey, tolkensValues) {
      return {
        selector: '[' + ngClass + ']',
        attrName: ngClass,
        process: function(index, attrValue){
          return compose(
            ifElse(isStringStyle, replaceStringStyle(tolkenKey, tolkensValues[index]), identity),
            ifElse(isMapStyle, replaceMapStyle(tolkenKey, tolkensValues[index]), identity))(attrValue);
        }
      };
    });
  };

  var replaceNgClass = replaceAngularClass('ng-class');
  var replaceDataNgClass = replaceAngularClass('data-ng-class');

  function getRefactoredHTML(tolkensMap, htmlStr){
    return compose(
      replaceFor(tolkensMap),
      replaceID(tolkensMap),
      replaceClass(tolkensMap),
      replaceDataNgClass(tolkensMap),
      replaceNgClass(tolkensMap))(htmlStr);
  }

  return {
    removeDot: removeDot,
    removeHash: removeHash,
    parser: parser,
    isMapStyle: isMapStyle,
    isStringStyle: isStringStyle,
    replaceMapStyle: replaceMapStyle,
    replaceStringStyle: replaceStringStyle,
    replaceID: replaceID,
    replaceFor: replaceFor,
    replaceClass: replaceClass,
    replaceNgClass: replaceNgClass,
    replaceDataNgClass: replaceDataNgClass,
    getRefactoredHTML: getRefactoredHTML
  };
};