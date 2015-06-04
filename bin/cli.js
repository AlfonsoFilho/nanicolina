#!/usr/bin/env node

'use strict';

process.title = 'Shrink Selectors';

var ShrinkSelectors = require('../shrink-selectors.js');

var shrink = new ShrinkSelectors({
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

