'use strict';

module.exports = function () {

  var fs = require('fs');
  var path = require('path');
  var css = require('css');

  var R = require('ramda');
  // Make Ramda available in global scope
  for(var fn in R){
    global[fn] = R[fn];
  }


  var VERSION = '0.0.0';

  var ATTR = /(\S+)=["]?((?:.(?!["]?\s+(?:\S+)=|[>"]))+.)["]?/g;
  var CLASS_ATTR = /^class=/g;
  var ID_ATTR = /^id=/g;
  var NG_CLASS_ATTR = /^(ng-class|data-ng-class)=/g;
  var QUOTES_CONTENT = /"([^"]*)"/;
  var WHITESPACE = /\s+/g;
  var NG_CLASS_VALUES = /'([^']*)'/g;
  var CLASS = /\.[\w-]*/g;

  var RADIX = 26;

  var tolkensMap = [];



  var getVersion = function(){
    return VERSION;
  };

  var getAttributesFromHTML = compose(
    match(ATTR),
    toLower);

  var getClassAttributes = filter(match(CLASS_ATTR));

  var getIdAttributes = filter(match(ID_ATTR));

  var getNgClassAttributes = filter(match(NG_CLASS_ATTR));

  var getAttrValue = function(str) { // TODO: Figure out a better solution, maybe regex is wrong
    return match(QUOTES_CONTENT, str)[1];
  };

  var getAttrValueList = split(WHITESPACE);

  var getNgClassValueList = compose(
    map(replace(/\'/g, '')), // TODO: Figure out a better solution, maybe regex is wrong
    match(NG_CLASS_VALUES));

  var toRadix = function (N, radix) {
    //http://www.javascripter.net/faq/convert3.htm?t1=toRadix%2810%2C25%29

    var HexN="",
        Q=Math.floor(Math.abs(N)),
        R;

    while (true) {
      R = Q % radix;
      HexN = "abcdefghijklmnopqrstuvwxyz".charAt(R) + HexN;
      Q = ( Q - R ) / radix;
      if ( Q === 0 ) {
        break;
      }
    }

    return ((N<0) ? "-" + HexN : HexN);
  };

  var convert2Tolken = function (name, type, tolkens) {
    return {
      name: name,
      type: type,
      tolken: toRadix(tolkens.length, RADIX)
    };
  };

  var addTolken = function (name, type, tolkens) {

    if(isNil(find(propEq('name', name), tolkens))){
      tolkens.push(convert2Tolken(name, type, tolkens));
    }

    return tolkens;
  };

  var getClass = compose(
    flatten,
    filter(not(isNil)),
    map(match(CLASS))
  );

  var getClassFromMedia = compose(
    ifElse(
      propEq('type', 'media'),
        prop('rules'),
        I
    )
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
          I,
          append(value)
      )
    )(acc);
  };

  var getClassesFromCSS = compose(
    reduce(removeDuplicate, []),
    flatten,
    map(getClass),
    map(prop('selectors')),
    filter(propEq('type', 'rule')),
    flatten,
    map(getClassFromMedia),
    prop('rules'),
    prop('stylesheet'),
    css.parse
  );

  var getTolkensMap = function (cssStr) {
    var classes = getClassesFromCSS(cssStr);
    var tolkensMap = [];

    forEach(function (item) {
      addTolken(item, 'class', tolkensMap)
    }, classes);

    return tolkensMap;
  };

  var getRefactoredCSS = function(cssStr){

    forEach(function (item) {
      cssStr = cssStr.replace(new RegExp(item.name, 'g'), '.' + item.tolken);
    }, getTolkensMap(cssStr));

    return cssStr;

  };



  return {
    getVersion: getVersion,
    getAttributesFromHTML: getAttributesFromHTML,
    getClassAttributes: getClassAttributes,
    getIdAttributes: getIdAttributes,
    getNgClassAttributes: getNgClassAttributes,
    getAttrValue: getAttrValue,
    getAttrValueList: getAttrValueList,
    getNgClassValueList: getNgClassValueList,
    toRadix: toRadix,
    addTolken: addTolken,
    getClassesFromCSS: getClassesFromCSS,
    getRefactoredCSS: getRefactoredCSS,
    getTolkensMap: getTolkensMap
  };

};
