var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var fs = require('fs');
var path = require('path');
var Nanicolina = require("../lib/Nanicolina.js");

var rootPath = process.cwd();
var fixturesPath = path.join(rootPath, 'test', 'fixtures');
var expectedPath = path.join(rootPath, 'test', 'expected');

var N = new Nanicolina();

var srcHTML, srcJS, srcCSS, expectedHTML, expectedCSS;


beforeEach(function (done) {

  srcHTML = fs.readFileSync(path.join(fixturesPath, 'test.html'), {encoding: 'utf8'});
  srcCSS = fs.readFileSync(path.join(fixturesPath, 'test.css'), {encoding: 'utf8'});
  expectedHTML = fs.readFileSync(path.join(expectedPath, 'test.html'), {encoding: 'utf8'});
  expectedCSS = fs.readFileSync(path.join(expectedPath, 'test.css'), {encoding: 'utf8'});

  srcCssA = fs.readFileSync(path.join(fixturesPath, 'a.css'), {encoding: 'utf8'});
  srcCssB = fs.readFileSync(path.join(fixturesPath, 'b.css'), {encoding: 'utf8'});
  expectedCssA = fs.readFileSync(path.join(expectedPath, 'a.css'), {encoding: 'utf8'});
  expectedCssB = fs.readFileSync(path.join(expectedPath, 'b.css'), {encoding: 'utf8'});

  done();

});


describe('Find ids and classes on html', function () {

  it('should list all tags attributes', function () {
    var attributes = [
      'lang="en"',
      'charset="utf-8"',
      'id="main"',
      'class="content container"',
      'role="document"',
      'data-ng-class="{\'hidden\': ishidden(), \'is-home\': ishome()}"',
      'class="row"',
      'class="col-xs-12 col-sm-8 col-lg-4"',
      'class="title visible-xs"',
      'id="close"',
      'href="http://www.google.com"',
      'class="link js-link"',
      'ng-class="{\'open\': isopen()}"',
    ];

    expect(N.getAttributesFromHTML(srcHTML)).to.deep.equal(attributes);
  });

  it('should list all class attributes', function () {
    var attrList = N.getAttributesFromHTML(srcHTML);
    var expectedArray = [
      'class="content container"',
      'class="row"',
      'class="col-xs-12 col-sm-8 col-lg-4"',
      'class="title visible-xs"',
      'class="link js-link"',
    ];

    expect(N.getClassAttributes(attrList)).to.be.deep.equal(expectedArray);

  });

  it('should list all id attributes', function () {

    var attrList = N.getAttributesFromHTML(srcHTML);
    var expectedArray = [
      'id="main"',
      'id="close"'
    ];

    expect(N.getIdAttributes(attrList)).to.be.deep.equal(expectedArray);

  });

  it('should list all ng-class attributes', function () {
    var attrList = N.getAttributesFromHTML(srcHTML);
    var expectedArray = [
      'data-ng-class="{\'hidden\': ishidden(), \'is-home\': ishome()}"',
      'ng-class="{\'open\': isopen()}"'
    ];

    expect(N.getNgClassAttributes(attrList)).to.be.deep.equal(expectedArray);

  });

  it('should get attribute value', function () {
    var attrList = N.getAttributesFromHTML(srcHTML);

    expect(attrList[2]).to.be.equal('id="main"');
    expect(N.getAttrValue(attrList[2])).to.be.equal('main');
    expect(attrList[5]).to.be.equal('data-ng-class="{\'hidden\': ishidden(), \'is-home\': ishome()}"');
    expect(N.getAttrValue(attrList[5])).to.be.equal('{\'hidden\': ishidden(), \'is-home\': ishome()}');
    expect(attrList[7]).to.be.equal('class="col-xs-12 col-sm-8 col-lg-4"');
    expect(N.getAttrValue(attrList[7])).to.be.equal('col-xs-12 col-sm-8 col-lg-4');
  });

  it('should get list/array from attribute value', function () {
    var attrList = N.getAttributesFromHTML(srcHTML);

    expect(N.getAttrValueList(N.getAttrValue(attrList[2]))).to.be.deep.equal(['main']);
    expect(N.getAttrValueList(N.getAttrValue(attrList[3]))).to.be.deep.equal(['content', 'container']);
    expect(N.getAttrValueList(N.getAttrValue(attrList[7]))).to.be.deep.equal(['col-xs-12', 'col-sm-8', 'col-lg-4']);
  });

  it('should get list/array from attribute value from ng-class', function () {
    var attrList = N.getAttributesFromHTML(srcHTML);

    expect(N.getNgClassValueList(N.getAttrValue(attrList[5]))).to.be.deep.equal(['hidden', 'is-home']);
    expect(N.getNgClassValueList(N.getAttrValue(attrList[12]))).to.be.deep.equal(['open']);

  });

  it('should refactor html with tolkens', function () {
    var tolkensMap = [
      { name: '.content', type: 'class', tolken: 'a' },
      { name: '.container', type: 'class', tolken: 'b' },
      { name: '.hidden', type: 'class', tolken: 'c' },
      { name: '.is-home', type: 'class', tolken: 'd' },
      { name: '.row', type: 'class', tolken: 'e' },
      { name: '.col-xs-12', type: 'class', tolken: 'f' },
      { name: '.col-sm-8', type: 'class', tolken: 'g' },
      { name: '.col-lg-4', type: 'class', tolken: 'h' },
      { name: '.title', type: 'class', tolken: 'i' },
      { name: '.link', type: 'class', tolken: 'j' },
      { name: '.open', type: 'class', tolken: 'k' },
      { name: '.visible-xs', type: 'class', tolken: 'l' },
    ];
    expect(N.getRefactoredHTML(srcHTML, tolkensMap)).to.be.equal(expectedHTML);
  });

});

describe('Find ids and classes on css', function () {

  it('should get all css classes, not duplicated', function () {

    var expectArray = [
      '.content',
      '.container',
      '.hidden',
      '.is-home',
      '.row',
      '.col-xs-12',
      '.col-sm-8',
      '.col-lg-4',
      '.title',
      '.link',
      '.open',
      '.visible-xs',
    ];

    expect(N.getClassesFromCSS(srcCSS)).to.be.deep.equal(expectArray);


  });

  it('should refactor css with tolkens', function () {
    var tolkensMap = [];
    expect(N.getRefactoredCSS(tolkensMap, srcCSS)).to.be.equal(expectedCSS);
  });

});

describe('Manage tolkens', function () {

  it('get letter from number', function () {
    var BASE = 26;
    expect(N.toRadix(0, BASE)).to.be.equal('a');
    expect(N.toRadix(25, BASE)).to.be.equal('z');
    expect(N.toRadix(26, BASE)).to.be.equal('ba');
    expect(N.toRadix(27, BASE)).to.be.equal('bb');
    expect(N.toRadix(37, BASE)).to.be.equal('bl');
    expect(N.toRadix(38, BASE)).to.be.equal('bm');
    expect(N.toRadix((26*2), BASE)).to.be.equal('ca');
    expect(N.toRadix((26*10), BASE)).to.be.equal('ka');
    expect(N.toRadix((26*26), BASE)).to.be.equal('baa');
  });

  it('addTolken', function () {
    var tolkensMap = [];
    var expectedArrayA = [
      { name: 'hidden', type: 'class', tolken: 'a' },
    ];
    var expectedArrayB = [
      { name: 'hidden', type: 'class', tolken: 'a' },
      { name: 'col-xs-12', type: 'class', tolken: 'b' },
    ];

    expect(N.addTolken('hidden', 'class', tolkensMap)).to.be.deep.equal(expectedArrayA);
    expect(N.addTolken('hidden', 'class', tolkensMap)).to.be.deep.equal(expectedArrayA);
    expect(N.addTolken('col-xs-12', 'class', tolkensMap)).to.be.deep.equal(expectedArrayB);
  });

  it('get tolkens map', function () {
    var tolkensMap = [];
    var expectedArray = [
      { name: '.content', type: 'class', tolken: 'a' },
      { name: '.container', type: 'class', tolken: 'b' },
      { name: '.hidden', type: 'class', tolken: 'c' },
      { name: '.is-home', type: 'class', tolken: 'd' },
      { name: '.row', type: 'class', tolken: 'e' },
      { name: '.col-xs-12', type: 'class', tolken: 'f' },
      { name: '.col-sm-8', type: 'class', tolken: 'g' },
      { name: '.col-lg-4', type: 'class', tolken: 'h' },
      { name: '.title', type: 'class', tolken: 'i' },
      { name: '.link', type: 'class', tolken: 'j' },
      { name: '.open', type: 'class', tolken: 'k' },
      { name: '.visible-xs', type: 'class', tolken: 'l' },
    ];

    expect(N.getTolkensMap(tolkensMap, srcCSS)).to.be.deep.equal(expectedArray);
  });

});

describe('Main functions', function () {
  it('should glue everything', function () {

    var expectedObject = { css: [expectedCssA, expectedCssB] };

    var result = N.rename({
      css: [srcCssA, srcCssB]
    });

    // expect(result).to.be.deep.equal(expectedObject);
    expect(result.css[0]).to.be.deep.equal(expectedObject.css[0]);
    expect(result.css[1]).to.be.deep.equal(expectedObject.css[1]);

  })
});



describe('Get Version', function () {
  it('should get version', function () {
    expect(N.getVersion()).to.equal('0.0.0');
  })
});




/*


1. Prepara lista de tokens

Procura html
2. Procura por atributos class √
3. Procura por atributos id √
4. Procura por atributos ng-class √

Procura por tokens javacript
5. Procura por getElementById
6. Procura por getElementsByClassName
7. Procura por documentSelector
8. Procura por element.className (add remove toggle contain)
8. Procura por element.setAttribute (getAttribute)

Procura por tokens jquery
8. Procura por $().addClass
9. Procura por $().removeClass
10. Procura por $().toggleClass
11. Procura por $().hasClass
12. Procura por $().attr('class') || $().attr({class:''})
13. Procura por $().attr('id') || $().attr({id:''})

14. Mapeia de tokens que exitem no js e no html
15. Procura por id e classes no css
16. Mapeia de tokens que exitem no css
17. Cria mapa com tokes que extem ao mesmo temo no html/js e no css
18. Faz o replace
19. Gera source map
20. Remove classes não utilizadas do css


*/


