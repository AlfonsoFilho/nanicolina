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



  var VERSION = '0.0.0';

  var ATTR = /(\S+)=["]?((?:.(?!["]?\s+(?:\S+)=|[>"]))+.)["]?/g;
  var CLASS_ATTR = /^class=/g;
  var ID_ATTR = /^id=/g;
  var NG_CLASS_ATTR = /^(ng-class|data-ng-class)=/g;
  var QUOTES_CONTENT = /"([^"]*)"/;
  var WHITESPACE = /\s+/g;
  var NG_CLASS_VALUES = /'([^']*)'/g;



  var getVersion = function(){
    return VERSION;
  };

  var getAttributesFromHTML = compose(
    match(ATTR),
    toLower);

  var getClassAttributes = filter(match(CLASS_ATTR));

  var getIdAttributes = filter(match(ID_ATTR));

  var getNgClassAttributes = filter(match(NG_CLASS_ATTR));

  var getAttrValue = function(str) {
    return match(QUOTES_CONTENT, str)[1];
  }

  var getAttrValueList = split(WHITESPACE);

  var getNgClassValueList = compose(
    map(replace(/\'/g, '')), // TODO: Figure out a better solution
    match(NG_CLASS_VALUES));



  return {
    getVersion: getVersion,
    getAttributesFromHTML: getAttributesFromHTML,
    getClassAttributes: getClassAttributes,
    getIdAttributes: getIdAttributes,
    getNgClassAttributes: getNgClassAttributes,
    getAttrValue: getAttrValue,
    getAttrValueList: getAttrValueList,
    getNgClassValueList: getNgClassValueList
  };

};
