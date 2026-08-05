'use strict';

/* Build-time content corrections. The output is ordinary, readable HTML and
 * remains complete when JavaScript is disabled in the visitor's browser. */
const officialHelp = 'https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/';
const verifiedOn = '5. srpna 2026';
const statusBox = `<div class="product-status" role="note"><strong>Informačně ověřeno: ${verifiedOn}.</strong> Google produkt 16. července 2026 přejmenoval z NotebookLM na Gemini Notebook. Některé části nápovědy, adresy webů a rozhraní mohou během přechodného období stále používat původní název NotebookLM. Dostupnost se může lišit podle účtu, tarifu, věku, země, správce organizace a postupného zavádění. <a href="${officialHelp}" target="_blank" rel="noopener noreferrer" class="link-primary">Oficiální oznámení Google</a>.</div>`;
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
        [/Gemini NotebookLM/gi, 'Gemini Notebook']
    ]);

    if (!targetPages.has(relativePath)) return output;

    output = output.replace(/<main(\b[^>]*)>/i, `<main$1>${statusBox}`);
    output = output.replace(/<\/main>/i, `${sources}</main>`);
    return output;
}

module.exports = { renderAuditedContent, targetPages, verifiedOn };
