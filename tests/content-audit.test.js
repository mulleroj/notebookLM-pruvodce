'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');
const productInfo = fs.readFileSync(path.join(root, 'gemini-notebook-product-info.js'), 'utf8');
const builder = fs.readFileSync(path.join(root, 'scripts', 'build-production.js'), 'utf8');

test('current product content has a dated official-source notice', () => {
    assert.match(productInfo, /5\. srpna 2026/);
    assert.match(productInfo, /support\.google\.com\/notebooklm/);
    assert.match(productInfo, /noopener noreferrer/);
});

test('current content rejects obsolete or overconfident claims', () => {
    const forbidden = [
        /Gemini NotebookLM/,
        /143\+ dokumentů/,
        /192 Use Cases/,
        /pouze anglicky/,
        /dva AI hlasy/,
        /pouze prompt pro jiný nástroj/,
        /Lecture Mode -/
    ];
    forbidden.forEach((pattern) => assert.doesNotMatch(productInfo, pattern));
    assert.match(productInfo, /Samy o sobě ale nezaručují/);
    assert.match(productInfo, /PPTX.*bez aktuálního potvrzení/);
});

test('production build includes the central current-product file', () => {
    assert.match(builder, /gemini-notebook-product-info\.js/);
});
