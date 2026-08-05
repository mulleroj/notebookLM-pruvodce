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

test('entire homepage avoids obsolete limits, guarantees, and incorrect Studio chat workflow', () => {
    const root = path.resolve(__dirname, '..');
    const forbidden = [
        /Max 50 zdrojů/i,
        /Max 300 zdrojů/i,
        /Audio přehledy\s+aktuálně pouze v angličtině/i,
        /AI bude odpovídat POUZE/i,
        /Každá odpověď bude mít odkazy/i,
        /Vždy začněte konverzací v chatu před použitím Studio/i,
        /Neklikejte na Studio modul bez kontextu z chatu/i,
        /Chat-first přístup \(NEJLEPŠÍ\)/i,
        /V chatu před použitím Studio modulu napište/i,
        /plnou kontrolu nad obsahem, který půjde do Studio modulu/i,
        /vytvořte kontext v chatu[\s\S]{0,120}požádejte o modul/i,
        /Studio modul[\s\S]{0,80}použije kontext z chatu/i,
        /předchozí chat je povinný/i,
        /Studio použije předchozí konverzaci/i,
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
    assert.match(source, /U konkrétního výstupu Studia vyberte zdroje/);
    assert.match(source, /vlastní pokyny/);
    assert.match(source, /Chat je volitelná příprava/);
    assert.match(source, /hotový výstup vždy zkontrolujte/);
    assert.match(production, /U konkrétního výstupu Studia vyberte zdroje/);
    assert.match(production, /Chat je volitelná příprava/);
    assert.match(production, /hotový výstup vždy zkontrolujte/);
    assert.match(source, /Gemini Notebook/);
});

test('homepage describes Studio workflow and optional chat preparation accurately', () => {
    const source = read(path.resolve(__dirname, '..'), 'index.html');
    const production = read(outputRoot, 'index.html');
    const incorrectWorkflow = [
        /Chat-first přístup \(NEJLEPŠÍ\)/i,
        /V chatu před použitím Studio modulu napište/i,
        /Studio modul[\s\S]{0,80}použije kontext z chatu/i,
        /předchozí chat je povinný/i,
        /Studio použije předchozí konverzaci/i
    ];

    [source, production].forEach((html, index) => {
        incorrectWorkflow.forEach((pattern) => {
            assert.doesNotMatch(html, pattern, `homepage ${index === 0 ? 'source' : 'production'}: ${pattern}`);
        });
        assert.match(html, /U konkrétního výstupu Studia vyberte zdroje/);
        assert.match(html, /Chat je volitelná příprava/);
        assert.match(html, /automaticky nepřenáší/);
        assert.match(html, /hotový výstup vždy zkontrolujte/);
    });
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

test('video overview describes current formats and Studio workflow', () => {
    const root = path.resolve(__dirname, '..');
    const source = read(root, 'modules/video-prehled.html');
    const production = read(outputRoot, 'modules/video-prehled.html');
    const forbidden = [
        /video-prehled-dialog\.png/i,
        /krátké nebo\s+výchozí/i,
        /AI použije kontext/i,
        /Kontext v chatu \(NEJLEPŠÍ\)/i,
        /NotebookLM použije váš chat jako základ pro video/i,
        /Vytvoř video přehled z této konverzace/i,
        /sidebar-badge">192/i
    ];
    [source, production].forEach((html) => {
        forbidden.forEach((pattern) => assert.doesNotMatch(html, pattern));
        assert.match(html, /Filmové \(Cinematic\)/);
        assert.match(html, /Výkladové \(Explainer\)/);
        assert.match(html, /Krátké video \(Short\)/);
        assert.match(html, /vyberte zdroje/);
        assert.match(html, /Chat lze použít/);
        assert.match(html, /automaticky nepřenáší/);
        assert.match(html, /Hotové video zkontrolujte/);
        assert.match(html, /video-prehled-visual-styles\.png/);
    });
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

test('every public Studio module explains source selection without chat-first claims', () => {
    const root = path.resolve(__dirname, '..');
    const studioModules = [
        'modules/audio-prehled.html', 'modules/video-prehled.html', 'modules/myslenkova-mapa.html',
        'modules/zpravy-prehled.html', 'modules/karticky.html', 'modules/quiz.html',
        'modules/infografika.html', 'modules/prezentace.html', 'modules/tabulka-dat.html'
    ];
    const forbidden = [
        /použije kontext konverzace/iu,
        /použije váš chat jako základ/iu,
        /V chatu specifikuj zaměření/iu,
        /nejprve diskutuj v chatu/iu,
        /vytvoř výstup z této konverzace/iu
    ];

    studioModules.forEach((relativePath) => {
        [read(root, relativePath), read(outputRoot, relativePath)].forEach((html, index) => {
            assert.match(html, /data-source-guidance="studio-artifact"/i, `${relativePath} (${index}): marker`);
            assert.match(html, /Zdroje pro tento výstup/iu, `${relativePath} (${index}): heading`);
            assert.match(html, /relevantn|patří k danému tématu|materiály k (?:danému|procvičovanému) tématu|pouze tematicky/iu, `${relativePath} (${index}): relevant sources`);
            assert.match(html, /(?:výsledek|hotové video|hotové kartičky|otázky i odpovědi|hotový výstup|hotovou mapu|hotovou zprávu|hodnoty).*zkontrolujte|zkontrolujte.*(?:výsledek|zdroj)/isu, `${relativePath} (${index}): review result`);
            forbidden.forEach((pattern) => assert.doesNotMatch(html, pattern, `${relativePath} (${index}): ${pattern}`));
        });
    });
});

test('agent functions page documents capabilities, limits, and teacher review without guarantees', () => {
    const root = path.resolve(__dirname, '..');
    const forbidden = [
        /dostupné všem/iu,
        /funguje u každého účtu/iu,
        /zcela autonomní/iu,
        /výsledek je vždy správný/iu,
        /citace zaručují správnost/iu,
        /agentní funkce jsou bezpečné/iu,
        /agentní funkce jsou dostupné všem/iu,
        /dohled zabrání všem chybám/iu,
        /výstupy jsou vždy správné/iu
    ];
    [read(root, 'agentni-funkce.html'), read(outputRoot, 'agentni-funkce.html')].forEach((html, index) => {
        assert.match(html, /Deep Research/i, `agent page ${index}: Deep Research`);
        assert.match(html, /agentní funkce/iu, `agent page ${index}: agentic functions`);
        assert.match(html, /které nalezené výsledky skutečně importujete/iu, `agent page ${index}: import choice`);
        assert.match(html, /zkontrolujte/iu, `agent page ${index}: review`);
        assert.match(html, /zaváděny postupně|dostupnost se může lišit/iu, `agent page ${index}: rollout`);
        assert.match(html, /pokročilejší uvažování/iu, `agent page ${index}: reasoning`);
        assert.match(html, /cloudové prostředí.*spouštět kód/isu, `agent page ${index}: cloud code`);
        assert.match(html, /experimentální/iu, `agent page ${index}: experimental status`);
        assert.match(html, /počáteční fázi vývoje|rané fázi vývoje/iu, `agent page ${index}: early development`);
        assert.match(html, /dohled uživatele/iu, `agent page ${index}: user supervision`);
        assert.match(html, /Google AI Ultra/iu, `agent page ${index}: current availability`);
        assert.match(html, /na počítači|desktop/iu, `agent page ${index}: desktop availability`);
        assert.match(html, /answer\/16179559/iu, `agent page ${index}: official chat help`);
        assert.match(html, /Občanská nauka|Praktické využití pro učitele/iu, `agent page ${index}: teacher example`);
        forbidden.forEach((pattern) => assert.doesNotMatch(html, pattern, `agent page ${index}: ${pattern}`));
    });
});
