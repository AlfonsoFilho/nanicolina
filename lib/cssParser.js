module.exports = function () {

  var utils = require('./utils.js')();
  var css = require('css');

  utils.globalRamda();

  var getSelector = curry(function (regex, string) {
    return compose(
      flatten,
      filter(compose(not, isNil)),
      map(match(regex))
    )(string);
  });

  var getClass = getSelector(/\.([\w-]*)/g);

  var getID = getSelector(/\#([\w-]*)/g);

  var removeDuplicate = function (acc, value) {

    var hasInAcc = curry(function (value, acc) {
      return find(function (item) {
        return item === value;
      }, acc);
    });

    return compose(
      ifElse(
        hasInAcc(value),
          identity,
          append(value)
      )
    )(acc);
  };

  var getClassFromMedia = compose( // Object => Object
    ifElse(
      propEq('type', 'media'),
        prop('rules'),
        identity));

  var getSelectorsFromCSS = compose( // CSS String => List of Selectors
    reduce(removeDuplicate, []),
    flatten,
    converge(concat, map(getClass), map(getID)),
    map(prop('selectors')),
    filter(propEq('type', 'rule')),
    flatten,
    map(getClassFromMedia),
    prop('rules'),
    prop('stylesheet'),
    css.parse);

  var replaceID = function(tolkenKey, tolkenValue, cssStr){
    return replace(new RegExp('(\\' + tolkenKey + ')([\.\[>:,{ ])', 'g'), '#' + tolkenValue + '$2', cssStr);
  };

  var replaceClass = function(tolkenKey, tolkenValue, cssStr){
    return replace(new RegExp('(\\' + tolkenKey + ')([\.\[>:,{ ])', 'g'), '.' + tolkenValue + '$2', cssStr);
  };

  var getRefactoredCSS = function(tolkensMap, cssStr){

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);

    forEachIndexed(function (item, index) {
      cssStr =  /^\#/.test(item) ? replaceID(item, tolkensValues[index], cssStr) : replaceClass(item, tolkensValues[index], cssStr);
    }, tolkensKeys);

    return cssStr;
  };

  return {
    getSelectorsFromCSS: getSelectorsFromCSS,
    getClassFromMedia: getClassFromMedia,
    removeDuplicate: removeDuplicate,
    getClass: getClass,
    getID: getID,
    getRefactoredCSS: getRefactoredCSS,
    replaceID: replaceID,
    replaceClass: replaceClass
  };

};