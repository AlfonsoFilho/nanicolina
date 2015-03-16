module.exports = function () {

  var cssParser = require('./cssParser.js')();
  var utils = require('./utils.js');

  utils.globalRamda();

  var RADIX = 52;

  var convert2Tolken = function (name, type, tolkens) {
    var obj = {};
    var prefix = type === 'class' ? '.' : '#';
    obj[prefix + name] = utils.toRadix(utils.getObjectLength(tolkens), RADIX);
    return obj;
  };

  var addTolken = function (name, type, tolkens) {
    return merge(convert2Tolken(name, type, tolkens), tolkens);
  };

  var getTolkensMap = curry(function (_tolkensMap, cssStr) {

    var classes = cssParser.getClassesFromCSS(cssStr);

    forEach(function (item) {
      _tolkensMap = addTolken(item, 'class', _tolkensMap);
    }, classes);

    return _tolkensMap;
  });


  return {
    getMap: getTolkensMap,
    add: addTolken,
    convert: convert2Tolken
  };
};