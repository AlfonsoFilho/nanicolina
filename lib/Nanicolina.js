'use strict';

module.exports = function () {

  var R = require('ramda');
  var filter = R.filter;
  var compose = R.compose;
  var toLower = R.toLower;
  var match = R.match;
  var split = R.split;
  var replace = R.replace;
  var map = R.map;
  var curry = R.curry;
  var append = R.append;



  var VERSION = '0.0.0';

  var ATTR = /(\S+)=["]?((?:.(?!["]?\s+(?:\S+)=|[>"]))+.)["]?/g;
  var CLASS_ATTR = /^class=/g;
  var ID_ATTR = /^id=/g;
  var NG_CLASS_ATTR = /^(ng-class|data-ng-class)=/g;
  var QUOTES_CONTENT = /"([^"]*)"/;
  var WHITESPACE = /\s+/g;
  var NG_CLASS_VALUES = /'([^']*)'/g;

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
      if ( Q == 0 ) {
        break;
      }
    }

    return ((N<0) ? "-" + HexN : HexN);
  };

  var convert2Tolken = function (name, type, index) {
    return {
      name: name,
      type: type,
      tolken: toRadix(index, RADIX)
    };
  }

  var addTolken = function (name, type, tolkens) {
    tolkens.push(convert2Tolken(name, type, tolkens.length));
    return tolkens;
  }


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
    addTolken: addTolken
  };

};
