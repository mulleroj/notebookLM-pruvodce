'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const { outputRoot } = require('../scripts/build-production.js');

const auditedPages = [
    'index.html', 'jak-zacit.html', 'novinky.html', 'troubleshooting.html', 'spu-adhd.html', 'use-cases.html',
    'modules/audio-prehled.html', 'modules/video-prehled.html', 'modules/prezentace.html',
    'modules/infografika.html', 'modules/tabulka-dat.html', 'modules/karticky.html', 'modules/quiz.html',
    'modules/myslenkova-mapa.html', 'modules/zpravy-prehled.html'
];

function page(relativePath) {
    return fs.readFileSync(path.join(outputRoot, relativePath), 'utf8');
}

test('audited content is rendered into production HTML without browser JavaScript', () => {
    const forbidden = [
        /Gemini NotebookLM/i,
        /Gemini Notebook pro učitele/i,
        /143\+ dokumentů/i,
        /(?:6|9)\s+modulů/i,
        /192\s+(?:praktických\s+)?use cases/i,
        /Lecture Mode - univerzitní přednáška/i,
        /Umí dokázat, že si nevymýšlí/i,
        /pouze anglicky/i
    ];

    auditedPages.forEach((relativePath) => {
        const html = page(relativePath);
        assert.match(html, /Informačně ověřeno: 5\. srpna 2026/);
        assert.match(html, /support\.google\.com\/notebooklm/);
        assert.match(html, /target="_blank" rel="noopener noreferrer"/);
        assert.match(html, /<title>[^<]*NotebookLM/i);
        assert.match(html, /<meta\s+name="description"\s+content="Neoficiální průvodce NotebookLM/i);
        forbidden.forEach((pattern) => assert.doesNotMatch(html, pattern, `${relativePath}: ${pattern}`));
    });
});

test('production HTML contains corrected presentation and infographic wording', () => {
    const presentation = page('modules/prezentace.html');
    const infographic = page('modules/infografika.html');
    assert.doesNotMatch(presentation, /pouze osnova.*(?:Gamma|PowerPoint)/i);
    assert.doesNotMatch(infographic, /pouze prompt/i);
    assert.match(presentation, /prezentaci/i);
    assert.match(infographic, /infografiku/i);
});

test('runtime page replacement has been removed', () => {
    const root = path.resolve(__dirname, '..');
    const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
    const builder = fs.readFileSync(path.join(root, 'scripts', 'build-production.js'), 'utf8');
    assert.doesNotMatch(script, /main\.innerHTML|TreeWalker|document\.title|gemini-notebook-product-info/);
    assert.match(builder, /renderAuditedContent/);
    assert.equal(fs.existsSync(path.join(root, 'gemini-notebook-product-info.js')), false);
});
