'use strict';

module.exports = function() {

  var cssParser = require('./cssParser.js')();
  var utils     = require('./utils.js')();

  var R       = require('ramda');
  var merge   = R.merge;
  var curry   = R.curry;
  var forEach = R.forEach;

  var convert2Tolken = function(name, tolkens) {
    var RADIX = 52;
    var obj = {};
    obj[name] = utils.toRadix(utils.getObjectLength(tolkens), RADIX);
    return obj;
  };

  var addTolken = function(name, tolkens) {
    return merge(convert2Tolken(name, tolkens), tolkens);
  };

  var getTolkensMap = curry(function(_tolkensMap, cssStr) {

    var selectors = cssParser.getSelectorsFromCSS(cssStr);

    forEach(function(item) {
      _tolkensMap = addTolken(item, _tolkensMap);
    }, selectors);

    return _tolkensMap;

  });

  return {
    getMap: getTolkensMap,
    add: addTolken,
    convert: convert2Tolken
  };
};
