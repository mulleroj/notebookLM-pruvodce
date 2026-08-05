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

function read(root, relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('source and production HTML use the official Gemini Notebook transition', () => {
    const root = path.resolve(__dirname, '..');
    const forbidden = [
        /Gemini NotebookLM/i,
        /(?:aktu[aá]ln[ií]|jedin[ýym])[^.]{0,80}NotebookLM/i,
        /přejmenov[aá]n[ií][^.]*(?:nen[ií]|nebylo)[^.]{0,40}ofici[aá]ln/i,
        /192\s+(?:praktick[ýych]\s+)?use cases/i,
        /143\+\s+(?:dokument|zdroj)/i,
        /Lecture Mode/i,
        /pouze anglicky/i
    ];

    auditedPages.forEach((relativePath) => {
        const source = read(root, relativePath);
        const html = read(outputRoot, relativePath);
        assert.match(source, /Gemini Notebook/i, `${relativePath}: source name`);
        assert.match(html, /Informačně ověřeno: 5\. srpna 2026/);
        assert.match(html, /16\. července 2026 přejmenoval z NotebookLM na Gemini Notebook/);
        assert.match(html, /support\.google\.com\/notebooklm/);
        assert.match(html, /<title>[^<]*Gemini Notebook/i);
        assert.match(html, /<meta\s+name="description"\s+content="[^"]*Gemini Notebook/i);
        forbidden.forEach((pattern) => {
            assert.doesNotMatch(source, pattern, `${relativePath}: source ${pattern}`);
            assert.doesNotMatch(html, pattern, `${relativePath}: production ${pattern}`);
        });
    });

    assert.match(read(root, 'index.html'), /Gemini Notebook \(dříve NotebookLM\)/);
});

test('source HTML directly corrects obsolete feature descriptions', () => {
    const root = path.resolve(__dirname, '..');
    const presentation = read(root, 'modules/prezentace.html');
    const infographic = read(root, 'modules/infografika.html');
    const news = read(root, 'novinky.html');
    assert.doesNotMatch(presentation, /pouze osnova.*(?:Gamma|PowerPoint)/i);
    assert.doesNotMatch(infographic, /ne přímo infografiku|vytvoří PROMPT/i);
    assert.doesNotMatch(news, /Lecture Mode|Roadmap 2026|Plánované funkce/i);
    assert.match(presentation, /prezentaci|slide deck/i);
    assert.match(infographic, /přímo vytvořit infografiku/i);
});

test('renderer is limited to shared audit infrastructure', () => {
    const root = path.resolve(__dirname, '..');
    const renderer = read(root, 'scripts/render-audited-content.js');
    const script = read(root, 'script.js');
    assert.match(renderer, /Gemini NotebookLM/);
    assert.doesNotMatch(renderer, /Lecture Mode|143\+|192 use cases|Gamma-ready|5-15/);
    assert.doesNotMatch(script, /main\.innerHTML|TreeWalker|document\.title|gemini-notebook-product-info/);
    assert.equal(fs.existsSync(path.join(root, 'gemini-notebook-product-info.js')), false);
});
