// ==========================================
// PROMPT TEMPLATES LIBRARY
// ==========================================

const PROMPTS = {
    // Master Filtering Prompt (for 20+ documents scenario)
    masterFilter: (topic) => `Jsi expertní analytik. Mám v podkladech mnoho dokumentů, ale chci se zaměřit VÝHRADNĚ na téma: "${topic}".
Ignoruj vše ostatní. Vytvoř 'Source Briefing' obsahující:
A. Definice a kontext.
B. Klíčová fakta a argumenty.
C. Data a čísla.
D. Citace.
Výstup si uložím jako poznámku.`,

    // Module-specific prompts
    modules: {
        1: { // Audio přehled
            name: "Audio přehled",
            icon: "🎧",
            template: (topic, scenarioNote) => `Zaměřte se na téma "${topic}". Vytvořte podrobnou analýzu pro posluchače, kteří se chtějí o tématu dozvědět více. Diskutujte konkrétní fakta, údaje a příklady ze zdrojů. Buďte konkrétní a zajímavý.${scenarioNote}`
        },
        2: { // Video přehled
            name: "Video přehled",
            icon: "🎬",
            template: (topic, scenarioNote) => `Vytvořte strukturované vizuální vysvětlení tématu "${topic}". Začněte úvodem, který zaujme pozornost, pokračujte třemi hlavními body s konkrétními fakty a daty ze zdrojů, zakončete výzvou k akci.\n\nINSPIRACE PRO STYL (volitelně, vyberte dle cílové skupiny):\n• Pro děti (ZŠ): Použijte hravý styl, jednoduché vysvětlení, barevné ilustrace, příběhový formát\n• Pro teenagery (SŠ): Moderní dynamický styl, praktické příklady, trendy vizuály, zábavný přístup\n• Pro dospělé (VŠ+): Profesionální analytický styl, podrobná data, infografiky, akademický přístup\n\nPrezentujte informace jasně a vizuálně zajímavě.${scenarioNote}`
        },
        3: { // Myšlenková mapa
            name: "Myšlenková mapa",
            icon: "🕸️",
            template: (topic, scenarioNote) => `POZNÁMKA: Myšlenková mapa v NotebookLM se generuje automaticky bez možnosti customizace. Stačí kliknout na tlačítko "Generovat myšlenkovou mapu" a NotebookLM vytvoří vizuální mapu ze zdrojů k tématu "${topic}".${scenarioNote}`
        },
        4: { // Zprávy
            name: "Zprávy",
            icon: "📄",
            template: (topic, scenarioNote) => `Vytvořte komplexní briefing dokument k tématu "${topic}" se strukturou:\n1. Executive Summary - klíčové poznatky (2-3 věty)\n2. Analýza situace s důkazy ze zdrojů\n3. Klíčová data, statistiky a čísla\n4. Závěry a doporučení\n\nAnalyzujte podrobně hlavní témata, důkazy a závěry ze zdrojů. Strukturujte logicky s nadpisy a odrážkami. Zachovejte objektivní a precizní tón. Citujte relevantní zdroje.${scenarioNote}`
        },
        5: { // Výukové kartičky
            name: "Výukové kartičky",
            icon: "🎴",
            template: (topic, scenarioNote) => `Zaměřte výukové kartičky na téma "${topic}". Kartičky by měly pokrývat klíčové pojmy a koncepty ze zdrojů. Přední strana kartiček musí být krátká (1-5 slov). Definice na zadní straně by měly být jasné a stručné (1-2 věty).${scenarioNote}`
        },
        6: { // Kvíz
            name: "Kvíz",
            icon: "❓",
            template: (topic, scenarioNote) => `Zaměřte kvíz na téma "${topic}". Kvíz musí testovat klíčové koncepty a fakta ze zdrojů. Otázky by měly být jasné a jednoznačné. Zaměřte se na nejdůležitější informace, které student potřebuje znát.${scenarioNote}`
        },
        7: { // Infografika
            name: "Infografika",
            icon: "📊",
            template: (topic, scenarioNote) => `Vytvořte infografiku k tématu "${topic}" s klíčovými statistikami a daty ze zdrojů. Zdůrazněte 3-5 nejdůležitějších číselných údajů nebo porovnání.\n\nINSPIRACE PRO BAREVNÉ SCHÉMA A STYL (volitelně):\n• Pro děti (ZŠ): Živé barvy (žlutá, oranžová, zelená), velké ikony, jednoduché grafy, hravé ilustrace\n• Pro teenagery (SŠ): Moderní paleta (teal, coral, purple), infografické prvky, cool design, trendy typografie\n• Pro dospělé (VŠ+): Profesionální barvy (modrá, šedá, zelená), detailní grafy, minimalistický design, čisté rozložení\n\nInfografika by měla být vizuálně přehledná a snadno pochopitelná.${scenarioNote}`
        },
        8: { // Prezentace
            name: "Prezentace",
            icon: "🖥️",
            template: (topic, scenarioNote) => `Vytvořte podrobnou prezentaci na téma "${topic}" s jasnou strukturou: úvod (Hook), hlavní body s fakty a daty ze zdrojů, závěr s CTA.\n\nINSPIRACE PRO STYL PREZENTACE (volitelně):\n• Pro děti (ZŠ): Interaktivní prvky, obrázky a animace, jednoduché výrazy, storytelling přístup, hry a kvízy\n• Pro teenagery (SŠ): Dynamický obsah, reálné příklady, moderní vizuály, praktické aplikace, krátké video klipy\n• Pro dospělé (VŠ+): Roční prezentace, podrobná data a grafy, citace zdrojů, komplexní analýza, case studies\n\nPrezentace by měla být vhodná pro cílovou skupinu, která se chce o tématu dozvědět více. Zahrňte konkrétní příklady a data.${scenarioNote}`
        },
        9: { // Tabulka dat
            name: "Tabulka dat",
            icon: "🔢",
            template: (topic, scenarioNote) => `Vytvořte tabulku relevantních dat k tématu "${topic}". Navrhněte sloupce: Položka/Název | Klíčové hodnoty | Zdroj. Extrahujte všechna číselná data, procenta, množství, ceny nebo jiné měřitelné údaje zmíněné ve zdrojích.${scenarioNote}`
        }
    }
};

// Get module info
function getModuleInfo(moduleNumber) {
    return PROMPTS.modules[moduleNumber];
}

// Get master filter prompt
function getMasterFilterPrompt(topic) {
    return PROMPTS.masterFilter(topic);
}

// Get module prompt with scenario handling
function getModulePrompt(moduleNumber, topic, hasFilteredData = false) {
    const module = PROMPTS.modules[moduleNumber];
    if (!module) return null;

    const scenarioNote = hasFilteredData
        ? "\n\nVycházej VÝHRADNĚ z uložené poznámky 'Source Briefing'."
        : "";

    return module.template(topic, scenarioNote);
}

// Get all modules for display
function getAllModules() {
    return Object.entries(PROMPTS.modules).map(([num, module]) => ({
        number: parseInt(num),
        name: module.name,
        icon: module.icon
    }));
}
