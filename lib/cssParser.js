module.exports = function () {

  var utils = require('./utils.js');
  var css = require('css');

  utils.globalRamda();

  var CLASS = /\.([\w-]*)/g;

  var getClass = compose(
    flatten,
    // filter(not(isNil)),
    filter(function (value) {
      return not(isNil(value));
    }),
    map(match(CLASS))
  );

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

  var getClassesFromCSS = compose( // CSS String => List of Classes
    map(replace(CLASS, '$1')),
    reduce(removeDuplicate, []),
    flatten,
    map(getClass),
    map(prop('selectors')),
    filter(propEq('type', 'rule')),
    flatten,
    map(getClassFromMedia),
    prop('rules'),
    prop('stylesheet'),
    css.parse);

  var getRefactoredCSS = function(tolkensMap, cssStr){

    var tolkensKeys = keys(tolkensMap);
    var tolkensValues = values(tolkensMap);

    forEachIndexed(function (item, index) {
      cssStr = replace(new RegExp('(\\' + item + ')([\.\[>:,{ ])', 'g'), '.' + tolkensValues[index] + '$2', cssStr);
    }, tolkensKeys);

    return cssStr;
  };

  return {
    getClassesFromCSS: getClassesFromCSS,
    getClassFromMedia: getClassFromMedia,
    removeDuplicate: removeDuplicate,
    getClass: getClass,
    getRefactoredCSS: getRefactoredCSS
  };

};