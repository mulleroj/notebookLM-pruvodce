'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const test = require('node:test');
const { chatbotAssetVersions, outputRoot } = require('../scripts/build-production.js');

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

test('citation wording does not guarantee links for every answer', () => {
    const root = path.resolve(__dirname, '..');
    const forbidden = [
        /Všechny odpovědi jsou podložené/i,
        /každá odpověď je podložená/i,
        /všechny odpovědi vždy obsahují (?:odkazy|citace)/i,
        /každá odpověď vždy obsahuje (?:odkazy|citace)/i
    ];
    const source = read(root, 'index.html');
    const production = read(outputRoot, 'index.html');
    forbidden.forEach((pattern) => {
        assert.doesNotMatch(source, pattern, `source index.html: ${pattern}`);
        assert.doesNotMatch(production, pattern, `dist/index.html: ${pattern}`);
    });
    assert.match(source, /Odpovědi mohou obsahovat odkazy na konkrétní části zdrojů/);
});

test('entire homepage avoids obsolete limits, guarantees, and chat-first workflow', () => {
    const root = path.resolve(__dirname, '..');
    const forbidden = [
        /Max 50 zdrojů/i,
        /Max 300 zdrojů/i,
        /Audio přehledy\s+aktuálně pouze v angličtině/i,
        /AI bude odpovídat POUZE/i,
        /Každá odpověď bude mít odkazy/i,
        /Vždy začněte konverzací v chatu před použitím Studio/i,
        /Neklikejte na Studio modul bez kontextu z chatu/i,
        /143\+/i,
        /Gamma-ready/i,
        /Vytváří prompty pro AI generátory obrázků/i,
        /Vytváří strukturovanou osnovu pro PowerPoint/i,
        /za 2 minuty místo 40 minut/i
    ];
    const source = read(root, 'index.html');
    const production = read(outputRoot, 'index.html');
    forbidden.forEach((pattern) => {
        assert.doesNotMatch(source, pattern, `source index.html: ${pattern}`);
        assert.doesNotMatch(production, pattern, `dist/index.html: ${pattern}`);
    });
    assert.match(source, /liší podle účtu, tarifu a aktuální nabídky/);
    assert.match(source, /Odpovědi mohou obsahovat odkazy na části zdrojů/);
    assert.match(source, /předchozí chat není povinný/);
    assert.match(source, /Gemini Notebook/);
});

test('production chatbot assets use deterministic content-derived versions', () => {
    const root = path.resolve(__dirname, '..');
    const versions = chatbotAssetVersions();
    const hash = (file) => crypto.createHash('sha256').update(read(root, file)).digest('hex').slice(0, 12);
    assert.equal(versions.knowledge, hash('chatbot-knowledge.js'));
    assert.equal(versions.chatbot, hash('chatbot.js'));
    assert.notEqual(versions.knowledge, crypto.createHash('sha256').update(read(root, 'chatbot-knowledge.js') + '\nmutation').digest('hex').slice(0, 12));

    const first = read(outputRoot, 'index.html');
    assert.match(first, new RegExp(`src="chatbot-knowledge\\.js\\?v=${versions.knowledge}"`));
    assert.match(first, new RegExp(`src="/chatbot\\.js\\?v=${versions.chatbot}"`));
    assert.doesNotMatch(first, /src="chatbot-knowledge\.js"/);
    assert.deepEqual(chatbotAssetVersions(), versions);
    assert.equal(read(outputRoot, 'index.html'), first);
    assert.match(read(outputRoot, 'chatbot-knowledge.js'), /Gemini Notebook/);
    assert.doesNotMatch(read(root, 'script.js'), /CHATBOT_KNOWLEDGE\s*=/);
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

test('chatbot source and production copy contain audited Gemini Notebook wording', () => {
    const root = path.resolve(__dirname, '..');
    const files = ['chatbot-knowledge.js', 'chatbot.js'];
    const forbidden = [
        /NotebookLM průvodce/i,
        /Chat s NotebookLM/i,
        /Začít s NotebookLM/i,
        /primárně EN/i,
        /60\+ use cases/i,
        /vždy cituje/i,
        /Umí dokázat, že si nevymýšlí/i,
        /super-schopnost, kterou ChatGPT nemá/i,
        /Ověřitelné informace/i,
        /automatick(?:é|y) (?:hodnocení|kvízy)(?![^.]{0,120}učitel)/i,
        /pouze osnova/i,
        /Export možný/i,
        /5-15 minut/i
    ];

    files.forEach((relativePath) => {
        const source = read(root, relativePath);
        const production = read(outputRoot, relativePath);
        assert.match(source, /Gemini Notebook/i, `${relativePath}: source name`);
        assert.match(production, /Gemini Notebook/i, `${relativePath}: production name`);
        forbidden.forEach((pattern) => {
            assert.doesNotMatch(source, pattern, `${relativePath}: source ${pattern}`);
            assert.doesNotMatch(production, pattern, `${relativePath}: production ${pattern}`);
        });
    });

    const knowledge = read(root, 'chatbot-knowledge.js');
    assert.match(knowledge, /notebooklm\.google\.com/);
    assert.match(knowledge, /dříve NotebookLM/);
    assert.match(knowledge, /Citace pomáhají dohledat podklad, ale nezaručují správnou ani úplnou interpretaci/);
    assert.match(knowledge, /kontroluje učitel/);
});
