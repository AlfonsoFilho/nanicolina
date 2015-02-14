var assert = require("assert");
var chai = require("chai");
var expect = chai.expect;
var Nanicolina = require("../lib/Nanicolina.js");

var N = new Nanicolina();

var html, js, css;


beforeEach(function (done) {
  html = [
    '<html>',
      '<head>',
        '<title>Teste</title>',
      '</head>',
      '<body>',
        '<div id="main" CLASS="content container" role="document" data-ng-class="{\'hidden\': isHidden(), \'is-home\': isHome()}">',
          '<div class="row">',
            '<div class="col-xs-12 col-sm-8 col-lg-4">',
              '<h1 class="title visible-xs">Title</h1>',
              '<a id="close" href="http://www.google.com" class="link js-link" ng-class="{\'open\': isOpen()}">Close</a>',
            '</div>',
          '</div>',
        '</div>',
      '</body>',
    '</html>'
  ].join('');

  css = [
    'body {',
      'margin: 0;',
      'padding: 0;',
    '}',
    '#main {',
      'margin: 0;',
      'padding: 0;',
    '}',
    '#main.content {',
      'margin: 0;',
      'padding: 0;',
    '}',
    '#main.content container {',
      'margin: 0;',
      'padding: 0;',
    '}',
    'div[role=\'document\'] {',
      'margin: 0;',
      'padding: 0;',
    '}',
    'col-xs-12,',
    'col-sm-8,',
    'col-lg-4 {',
      'float: left;',
    '}'

  ].join('');
  done();
});


describe('Find ids and classes on html', function () {

  it('should list all tags attributes', function () {
    var attributes = [
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

    expect(N.getAttributesFromHTML(html)).to.deep.equal(attributes);
  });

  it('should list all class attributes', function () {
    var attrList = N.getAttributesFromHTML(html);
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

    var attrList = N.getAttributesFromHTML(html);
    var expectedArray = [
      'id="main"',
      'id="close"'
    ];

    expect(N.getIdAttributes(attrList)).to.be.deep.equal(expectedArray);

  });

  it('should list all ng-class attributes', function () {
    var attrList = N.getAttributesFromHTML(html);
    var expectedArray = [
      'data-ng-class="{\'hidden\': ishidden(), \'is-home\': ishome()}"',
      'ng-class="{\'open\': isopen()}"'
    ];

    expect(N.getNgClassAttributes(attrList)).to.be.deep.equal(expectedArray);

  });

  it('should get attribute value', function () {
    var attrList = N.getAttributesFromHTML(html);

    expect(attrList[0]).to.be.equal('id="main"');
    expect(N.getAttrValue(attrList[0])).to.be.equal('main');
    expect(attrList[3]).to.be.equal('data-ng-class="{\'hidden\': ishidden(), \'is-home\': ishome()}"');
    expect(N.getAttrValue(attrList[3])).to.be.equal('{\'hidden\': ishidden(), \'is-home\': ishome()}');
    expect(attrList[5]).to.be.equal('class="col-xs-12 col-sm-8 col-lg-4"');
    expect(N.getAttrValue(attrList[5])).to.be.equal('col-xs-12 col-sm-8 col-lg-4');
  });

  it('should get list/array from attribute value', function () {
    var attrList = N.getAttributesFromHTML(html);

    expect(N.getAttrValueList(N.getAttrValue(attrList[0]))).to.be.deep.equal(['main']);
    expect(N.getAttrValueList(N.getAttrValue(attrList[5]))).to.be.deep.equal(['col-xs-12', 'col-sm-8', 'col-lg-4']);
  });

  it('should get list/array from attribute value from ng-class', function () {
    var attrList = N.getAttributesFromHTML(html);

    expect(N.getNgClassValueList(N.getAttrValue(attrList[3]))).to.be.deep.equal(['hidden', 'is-home']);
    expect(N.getNgClassValueList(N.getAttrValue(attrList[10]))).to.be.deep.equal(['open']);

  });



  it.skip('should be an example', function () {
  });

});


describe('Get Version', function () {
  it('should get version', function () {
    expect(N.getVersion()).to.equal('0.0.0');
  })
});




/*


1. Prepara lista de tokens

Procura html
2. Procura por atributos class
3. Procura por atributos id
4. Procura por atributos ng-class

Procura por tokens javacript
5. Procura por getElementById
6. Procura por getElementsByClassName
7. Procura por documentSelector
8. Procura por element.className (add remove toggle contain)

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
