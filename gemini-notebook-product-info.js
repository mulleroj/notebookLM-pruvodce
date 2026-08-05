/*
 * Jediné místo pro proměnlivé informace o produktu v tomto statickém webu.
 * Ověřeno proti nápovědě Google dne 5. srpna 2026. Nejde o dokumentaci Google.
 */
(function () {
    'use strict';

    const info = window.geminiNotebookProductInfo = {
        productName: 'NotebookLM',
        formerName: null,
        verifiedOn: '5. srpna 2026',
        availability: 'Dostupnost se může lišit podle účtu, tarifu, věku, země, správce organizace a postupného zavádění.',
        sources: {
            overview: 'https://support.google.com/notebooklm/answer/16164461',
            notebook: 'https://support.google.com/notebooklm/answer/16206563',
            sourceTypes: 'https://support.google.com/notebooklm/answer/16215270',
            faq: 'https://support.google.com/notebooklm/answer/16269187',
            mobile: 'https://support.google.com/notebooklm/answer/16296687',
            mindMaps: 'https://support.google.com/notebooklm/answer/16212283',
            help: 'https://support.google.com/notebooklm/'
        }
    };

    const external = (href, label) => `<a href="${href}" target="_blank" rel="noopener noreferrer" class="link-primary">${label}</a>`;
    const notice = () => `<div class="product-status" role="note"><strong>Informačně ověřeno: ${info.verifiedOn}.</strong> ${info.availability} Podrobnosti vždy ověřte v ${external(info.sources.help, 'nápovědě Google')}.</div>`;
    const officialSources = () => `<section class="section official-sources"><h2 class="section-title">Oficiální zdroje a další informace</h2><ul><li>${external(info.sources.overview, 'Co je NotebookLM')}</li><li>${external(info.sources.notebook, 'Vytvoření notebooku, Studio, sdílení a exporty')}</li><li>${external(info.sources.sourceTypes, 'Podporované zdroje a jejich omezení')}</li><li>${external(info.sources.faq, 'Časté dotazy, soukromí a limity')}</li><li>${external(info.sources.mobile, 'Mobilní aplikace')}</li></ul></section>`;
    const caution = `<div class="warning-box"><strong>Kontrola učitelem je nezbytná.</strong> Výstupy AI mohou chybně zjednodušit, vynechat nebo nesprávně interpretovat zdroj. Ověřte věcnou správnost, přiměřenost věku, autorská práva a citlivé údaje.</div>`;
    const layout = (title, lead, body) => `${notice()}<section class="section"><h1 class="section-title">${title}</h1><p class="text-lg-relaxed">${lead}</p>${body}</section>${officialSources()}`;

    const pages = {
        'index.html': () => layout('NotebookLM pro učitele', 'NotebookLM je výzkumný asistent od Google pro práci se zdroji, otázky s odkazy, objevování podkladů a tvorbu studijních či multimediálních výstupů.', `
            <h2>Co umí a co je vhodné čekat</h2><ul><li>Do notebooku lze přidat vlastní soubory, vybrané zdroje z Disku, weby, YouTube, audio, obrázky, text a výsledky hledání; podporované typy se liší podle platformy.</li><li>Chat pracuje s celou sadou nebo se zvolenými zdroji. Historie konverzace pomáhá navazovat, ale pro výstup ve Studiu vybírejte zdroje a pokyny přímo u něj.</li><li>Studio podle účtu nabízí například audio a video přehledy, reporty, myšlenkové mapy, kartičky, kvízy, prezentace, infografiky a datové tabulky.</li></ul>
            <h2>Citace nejsou záruka správnosti</h2><p>Odkazy na zdroje umožňují dohledat, z jaké části podkladů odpověď vychází. Samy o sobě ale nezaručují, že AI zdroj správně pochopila, úplně jej interpretovala nebo vyvodila správný závěr.</p>${caution}`),
        'jak-zacit.html': () => layout('Jak začít s NotebookLM', 'Začněte malým notebookem s důvěryhodnými podklady a konkrétním vzdělávacím cílem.', `
            <ol><li>Otevřete ${external('https://notebooklm.google.com/', 'NotebookLM')} a vytvořte notebook.</li><li>Přidejte zdroje. Na počítači jsou k dispozici širší možnosti než v mobilní aplikaci; u webů a videí ověřte, co bylo skutečně načteno.</li><li>Položte konkrétní otázku a otevřete odkazy na zdroje. Vyberte zdroje, se kterými má chat pracovat.</li><li>Ve Studiu vyberte výstup, jeho zdroje a vlastní pokyny. Chat je užitečný k přípravě tématu, není ale povinným krokem před Studiem.</li></ol>
            <h2>Ochrana dat ve škole</h2><p>Do osobního účtu nevkládejte identifikovatelné údaje žáků, zprávy z poradenských zařízení, diagnózy, IVP, kázeňské ani zdravotní záznamy, pokud škola použití služby výslovně neschválila. U školního účtu postupujte podle správce a pravidel školy.</p>${caution}`),
        'audio-prehled.html': () => layout('Audio přehled', 'Audio přehled je AI vytvořený poslechový výstup ze zvolených zdrojů. Nabídka jazyků, formátů, délky, hlasů a limitů závisí na účtu a rozhraní.', `
            <p>V nastavení zvolte zdroje, jazyk, délku a pokyny. Neberte zadanou délku jako přesný čas a nepředpokládejte pevný počet hlasů. Výslovnost jmen, zkratek i odborných výrazů může být chybná.</p><p>Mobilní aplikace umí audio vytvářet a přehrávat; stažené audio lze zpřístupnit pro poslech offline v aplikaci. Neznamená to, že celý produkt funguje offline.</p>${caution}`),
        'video-prehled.html': () => layout('Video přehled', 'Video přehled vytváří vizuální výstup založený na zvolených zdrojích. Dostupné formáty, styly, jazyky, tarify a případná věková omezení se mohou lišit.', `
            <p>Před generováním vyberte zdroje a nastavte účel, publikum a důraz. Video kontrolujte stejně jako text: zejména popisky, grafy, obrazy, vynechané souvislosti a odkazy na zdroje. Na mobilu lze video vytvářet, přehrát, sdílet a v dostupném rozhraní stáhnout; neuvádíme pevnou garantovanou délku.</p>${caution}`),
        'prezentace.html': () => layout('Prezentace', 'NotebookLM může ve Studiu přímo vytvořit prezentaci (Slide Deck) ze zvolených zdrojů; nejde jen o osnovu pro jinou službu.', `
            <p>V pokynech uveďte publikum, účel, hlavní sdělení a požadovaný rozsah. Po vytvoření zkontrolujte každý snímek, fakta, grafy, obrázky a vazbu na podklady. Oficiální dokumentace uvádí export reportů do Google Docs a tabulek do Google Sheets; pro Slide Deck neuvádíme PPTX ani jiný formát bez aktuálního potvrzení přímo v rozhraní.</p><p>Gamma, PowerPoint nebo Google Slides mohou být navazující pracovní postup, nikoli povinný mezikrok.</p>${caution}`),
        'infografika.html': () => layout('Infografiky', 'NotebookLM může ve Studiu přímo vytvářet infografiky ze zdrojů; nejde pouze o generování promptu pro jiný nástroj.', `
            <p>V dostupném dialogu zvolte zdroje, styl, orientaci a pokyny. Výsledek je vhodné stáhnout a před použitím pečlivě zkontrolovat: českou diakritiku, překlepy v obrázku, velikost písma, kontrast, hustotu informací a použitelnost při tisku A4. Neuvádíme univerzální exportní formát; mobilní nápověda potvrzuje u infografik uložení PNG do zařízení.</p>${caution}`),
        'tabulka-dat.html': () => layout('Datové tabulky', 'Datová tabulka je syntéza informací ze zdrojů, ne náhrada tabulkového procesoru ani ověřený výpočet.', `
            <p>Popište požadované řádky, sloupce a výběr zdrojů. Oficiální postup uvádí export datové tabulky do Google Sheets včetně samostatné karty s citacemi. Neuvádíme CSV, XLSX ani JSON jako obecně dostupné nativní exporty bez potvrzení. Čísla, jednotky, časová období i srovnatelnost hodnot vždy ověřte.</p>${caution}`),
        'karticky.html': () => layout('Kartičky', 'Kartičky jsou studijní výstup ve Studiu. Vzhled a možnosti procvičování se mohou lišit podle aktuální verze a platformy.', `
            <p>Před použitím zkontrolujte otázky, odpovědi, obtížnost a zda jsou tvrzení doložená zdrojem. Nevydáváme ruční kopírování do Anki nebo Quizletu za nativní export. Pro plnohodnotné nastavování a správu výstupů doporučuje Google webovou verzi.</p>${caution}`),
        'quiz.html': () => layout('Kvízy', 'Kvíz je návrh studijního procvičování, který musí učitel před nasazením ověřit.', `
            <p>AI může vytvořit více možných správných odpovědí, chybný klíč nebo nejednoznačnou otázku; odpověď navíc nemusí být přímo doložena zdrojem. Zkontrolujte úroveň třídy, formulace, spravedlnost hodnocení a citace. Nezaměňujte generovaný kvíz za automatické hodnocení žákovské práce.</p>${caution}`),
        'myslenkova-mapa.html': () => layout('Myšlenkové mapy', 'Myšlenková mapa vizualizuje vztahy, které AI navrhne ze zdrojů. Je k dispozici ve webovém Studiu; mobilní aplikace ji podle nápovědy zatím nepodporuje.', `
            <p>Mapu lze rozbalovat a v dostupném okně stáhnout nebo sdílet s notebookem. Nepředpokládejte, že chat automaticky přepíše konkrétní mapu. AI může vedlejší informaci povýšit na hlavní větev nebo naopak skrýt důležitý vztah.</p>${caution}`),
        'zpravy-prehled.html': () => layout('Reporty a dokumenty', 'Studio nabízí nativní typy reportů i možnost vlastního zadání; některé názvy v tomto průvodci jsou doporučené pracovní formáty, nikoli systémová tlačítka.', `
            <p>Mezi uvedenými nativními volbami mohou být FAQ, studijní průvodce, briefing a návrhy AI. Report lze podle nápovědy exportovat do Google Docs. Před sdílením ověřte citace, úplnost a strukturu.</p>${caution}`),
        'troubleshooting.html': () => layout('Řešení problémů', 'Postupujte podle konkrétní příčiny, ne podle univerzálních neověřených pravidel.', `
            <ul><li>Ověřte tarif, zemi, věk a zda se funkce již zavedla pro váš účet; u školy také nastavení správce.</li><li>Zkontrolujte vybrané zdroje, kvalitu textové vrstvy skenovaného PDF a omezení typu či velikosti souboru.</li><li>Propojené soubory z Disku mohou vyžadovat synchronizaci; nahrané soubory jsou kopie. U webu, YouTube a audia ověřte, zda se zdroj podařilo načíst či přepsat.</li><li>Při dosažení denního limitu vyčkejte nebo ověřte možnosti svého plánu. Nepředpokládejte, že audio či video vyžaduje dva zdroje, 500 slov nebo přesně deset souborů.</li><li>Mobilní aplikace má omezenější funkce než web; pro úpravy a nepodporovaný výstup přejděte na počítač.</li></ul>${caution}`),
        'spu-adhd.html': () => layout('SPU, ADHD a autismus: opatrné využití', 'Některým žákům může pomoci kratší členění textu, jasné mezikroky a viditelný cíl úkolu. Nejde však o univerzální řešení ani o zdravotní doporučení.', `
            <p>Výstup upravte pro konkrétního žáka: přiměřený rozsah, čitelné písmo, kontrast, tempo, alternativy ke zvuku a kontrolu kognitivní zátěže. Učitel posuzuje dostupnost i vhodnost; AI nemá diagnostikovat, hodnotit potřeby ani nahrazovat podpůrná opatření. Chraňte citlivé údaje a nevkládejte diagnózy ani dokumentaci žáků do osobního účtu.</p>${caution}`),
        'use-cases.html': () => layout('Praktické postupy pro učitele', 'Katalog slouží jako inspirace, nikoli jako pevné marketingové počítadlo. Každý postup označte podle toho, co skutečně dělá.', `
            <ul><li><strong>Nativní funkce:</strong> výstup vytvořený ve Studiu.</li><li><strong>Chatový postup:</strong> otázka či instrukce v chatu nad vybranými zdroji.</li><li><strong>Nastavení výstupu ve Studiu:</strong> pokyny, zdroje, jazyk nebo formát pro konkrétní artefakt.</li><li><strong>Export do jiné aplikace:</strong> až po ověření nativní možnosti exportu.</li><li><strong>Autorský tip / experimentální použití:</strong> není funkcí Google a vyžaduje více kontroly.</li></ul><p>Neslibujte přesnou délku audia či videa, automatický přenos minulého chatu, hotový test bez kontroly ani automatické hodnocení žáků.</p>${caution}`),
        'novinky.html': () => layout('Novinky a změny produktu', 'Tato stránka je průběžný rozcestník k oficiálním oznámením, ne neověřený roadmap. Položky označujte datem oznámení, datem dostupnosti, platformou, tarifem, jazykem, stavem a odkazem na Google.', `
            <p><strong>Stav k ověření na účtu:</strong> Funkce mohou být obecně dostupné, postupně zaváděné, experimentální nebo omezené tarifem. Starší „Lecture Mode“ není v tomto průvodci popisován jako samostatně potvrzený aktuální režim; pro aktuální nabídku zkontrolujte nastavení Audio přehledu a nápovědu Google.</p><p>Aktuální produktová orientace: Studio zahrnuje mimo jiné audio/video přehledy, reporty, datové tabulky, kartičky, kvízy, prezentace a infografiky; konkrétní nabídka se může lišit.</p>${caution}`)
    };

    function currentPage() {
        const path = location.pathname.replace(/^.*\//, '') || 'index.html';
        return pages[path] ? path : null;
    }

    function renderCurrentContent() {
        const page = currentPage();
        const main = document.querySelector('main');
        if (!page || !main) return;
        main.innerHTML = pages[page]();
        document.title = document.title.replace(/Gemini Notebook(?:LM)?/g, 'NotebookLM');
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach((node) => {
            node.nodeValue = node.nodeValue.replace(/Gemini Notebook(?:LM)?/g, 'NotebookLM');
        });
        document.body.classList.add('content-audit-2026-08');
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', renderCurrentContent);
    else renderCurrentContent();
}());
