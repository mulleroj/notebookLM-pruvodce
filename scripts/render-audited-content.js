'use strict';

/* Build-time content corrections. The output is ordinary, readable HTML and
 * remains complete when JavaScript is disabled in the visitor's browser. */
const officialHelp = 'https://support.google.com/notebooklm/';
const verifiedOn = '5. srpna 2026';
const statusBox = `<div class="product-status" role="note"><strong>Informačně ověřeno: ${verifiedOn}.</strong> Dostupnost se může lišit podle účtu, tarifu, věku, země, správce organizace a postupného zavádění. Podrobnosti ověřte v <a href="${officialHelp}" target="_blank" rel="noopener noreferrer" class="link-primary">oficiální nápovědě Google</a>.</div>`;
const sources = `<section class="section official-sources"><h2 class="section-title">Oficiální zdroje a další informace</h2><ul><li><a href="https://support.google.com/notebooklm/answer/16164461" target="_blank" rel="noopener noreferrer" class="link-primary">Co je NotebookLM</a></li><li><a href="https://support.google.com/notebooklm/answer/16206563" target="_blank" rel="noopener noreferrer" class="link-primary">Notebook, Studio, sdílení a exporty</a></li><li><a href="https://support.google.com/notebooklm/answer/16215270" target="_blank" rel="noopener noreferrer" class="link-primary">Podporované zdroje</a></li><li><a href="https://support.google.com/notebooklm/answer/16269187" target="_blank" rel="noopener noreferrer" class="link-primary">Limity a časté dotazy</a></li><li><a href="https://support.google.com/notebooklm/answer/16296687" target="_blank" rel="noopener noreferrer" class="link-primary">Mobilní aplikace</a></li></ul></section>`;

const targetPages = new Set([
    'index.html', 'jak-zacit.html', 'novinky.html', 'troubleshooting.html', 'spu-adhd.html', 'use-cases.html',
    'modules/audio-prehled.html', 'modules/video-prehled.html', 'modules/prezentace.html',
    'modules/infografika.html', 'modules/tabulka-dat.html', 'modules/karticky.html', 'modules/quiz.html',
    'modules/myslenkova-mapa.html', 'modules/zpravy-prehled.html'
]);

function replaceAll(html, replacements) {
    return replacements.reduce((value, [from, to]) => value.replace(from, to), html);
}

function renderAuditedContent(relativePath, html) {
    let output = replaceAll(html, [
        [/Gemini NotebookLM/gi, 'NotebookLM'],
        [/Gemini Notebook/gi, 'NotebookLM']
    ]);

    if (!targetPages.has(relativePath)) return output;

    output = replaceAll(output, [
        [/192 Způsobů Jak Využít NotebookLM/g, 'Praktické postupy s NotebookLM'],
        [/192 Use Cases/g, 'Praktické postupy'],
        [/Use Cases \(192\)/g, 'Praktické postupy'],
        [/>192</g, '>praktické postupy<'],
        [/192\s+praktických\s+use cases/gi, 'praktické postupy'],
        [/143\+ dokumentů/g, 'více zdrojů (limity závisejí na účtu)'],
        [/všech 6 modulů/g, 'dostupných funkcí Studia'],
        [/6 modulů/g, 'funkcí Studia'],
        [/9 modulů/g, 'funkcí Studia'],
        [/>9</g, '>dle účtu<'],
        [/Lecture Mode - univerzitní přednáška místo podcastu!/g, 'Aktuální nabídku audia ověřte v nápovědě Google.'],
        [/NotebookLM vytvoří OSNOVU s návrhy/g, 'NotebookLM může vytvořit prezentaci se zdrojově podloženým návrhem obsahu'],
        [/vytvoří detailní prompt pro AI generátory obrázků/g, 'může přímo vytvořit infografiku ze zvolených zdrojů'],
        [/pouze anglicky/gi, 'v podporovaných jazycích podle aktuálního účtu'],
        [/Umí dokázat, že si nevymýšlí\./g, 'Umožňuje dohledat zdroje, ale vyžaduje kontrolu interpretace.'],
        [/citace dokazují/gi, 'citace pomáhají dohledat zdroj']
    ]);

    output = output.replace(/<title>[^<]*<\/title>/i, (title) => title.replace(/Gemini NotebookLM|Gemini Notebook/g, 'NotebookLM'));
    output = output.replace(/(<meta\s+name=["']description["']\s+content=["'])[^"']*(["'][^>]*>)/i,
        '$1Neoficiální průvodce NotebookLM pro učitele: ověřené postupy, zdroje a omezení.$2');
    output = output.replace(/<main(\b[^>]*)>/i, `<main$1>${statusBox}`);
    output = output.replace(/<\/main>/i, `${sources}</main>`);
    return output;
}

module.exports = { renderAuditedContent, targetPages, verifiedOn };
