#!/usr/bin/env node

'use strict';

process.title = 'nanicolina';

var Nanicolina = require('../nanicolina.js');

var N = new Nanicolina({
  src: [
    'test/fixtures/a.css',
    'test/fixtures/b.css',
    'test/fixtures/a.html',
    'test/fixtures/b.html'
  ],
  dest: 'output',
  ext: '',
  exportMapTo: ''
});

