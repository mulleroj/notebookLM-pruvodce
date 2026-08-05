/**
 * Knowledge Base pro chatbot
 * Kompletní databáze obsahu webu NotebookLM průvodce
 * Tento soubor musí být načten PŘED chatbot.js
 */

window.CHATBOT_KNOWLEDGE = {
    // Hlavní stránky
    pages: {
        'index': {
            title: 'Hlavní stránka',
            url: 'index.html',
            sections: [
                { id: 'uvod', title: 'Úvod', keywords: ['začít', 'úvod', 'co je notebooklm', 'home', 'domů'] },
                { id: 'rychle-karty', title: 'Rychlé karty', keywords: ['rychlý start', 'první kroky', 'quick start'] },
                { id: 'studio-moduly', title: 'Studio Moduly', keywords: ['studio', 'moduly', 'nástroje', 'tools', 'panel'] },
                { id: 'chat', title: 'Chat s NotebookLM', keywords: ['chat', 'konverzace', 'ai', 'asistent'] },
                { id: 'citace', title: 'Citace', keywords: ['citace', 'zdroje', 'odkazy', 'reference'] }
            ]
        },
        'jak-zacit': {
            title: 'Jak začít',
            url: 'jak-zacit.html',
            sections: [
                { id: 'krok-za-krokem', title: 'Krok za krokem návod', keywords: ['začít', 'první kroky', 'návod', 'tutorial', 'průvodce'] },
                { id: 'registrace', title: 'Registrace', keywords: ['registrace', 'účet', 'přihlášení', 'login'] },
                { id: 'nahrání-zdrojů', title: 'Nahrání zdrojů', keywords: ['nahrát', 'upload', 'dokumenty', 'soubory', 'pdf'] }
            ]
        },
        'use-cases': {
            title: 'Use Cases',
            url: 'use-cases.html',
            sections: [
                { id: 'priprava', title: 'Příprava výuky', keywords: ['příprava', 'výuka', 'hodina', 'lekce', 'učení', 'vyučování'] },
                { id: 'hodnoceni', title: 'Hodnocení', keywords: ['hodnocení', 'známky', 'testy', 'zkoušení', 'evaluace'] },
                { id: 'admin', title: 'Administrativa', keywords: ['administrativa', 'papírování', 'zprávy', 'dokumentace'] },
                { id: 'spu', title: 'SPU a ADHD', keywords: ['spu', 'adhd', 'speciální potřeby', 'inkluze', 'podpora'] },
                { id: 'kreativita', title: 'Kreativní projekty', keywords: ['kreativita', 'projekty', 'tvořivost'] },
                { id: 'video', title: 'Video use cases', keywords: ['video'] },
                { id: 'audio', title: 'Audio use cases', keywords: ['audio', 'podcast'] },
                { id: 'flashcards', title: 'Flashcards use cases', keywords: ['kartičky', 'flashcards', 'cards'] },
                { id: 'quiz', title: 'Quiz use cases', keywords: ['kvíz', 'quiz', 'test'] },
                { id: 'infografika', title: 'Infografika use cases', keywords: ['infografika', 'vizualizace', 'grafika'] },
                { id: 'prezentace', title: 'Prezentace use cases', keywords: ['prezentace', 'slides', 'powerpoint'] },
                { id: 'myslenkova-mapa', title: 'Myšlenková mapa use cases', keywords: ['myšlenková mapa', 'mindmap', 'mapa'] },
                { id: 'tabulka', title: 'Tabulka dat use cases', keywords: ['tabulka', 'data', 'tabulky'] }
            ]
        },
        'troubleshooting': {
            title: 'Troubleshooting',
            url: 'troubleshooting.html',
            sections: [
                { id: 'chyby', title: 'Časté chyby', keywords: ['chyba', 'problém', 'nefunguje', 'error', 'bug'] },
                { id: 'limitace', title: 'Limitace', keywords: ['limit', 'omezení', 'nemůžu', 'nejde'] },
                { id: 'tipy', title: 'Tipy a triky', keywords: ['tipy', 'triky', 'hack', 'návod'] }
            ]
        },
        'spu-adhd': {
            title: 'SPU & ADHD',
            url: 'spu-adhd.html',
            sections: [
                { id: 'spu-nastroje', title: 'Nástroje pro SPU', keywords: ['spu', 'adhd', 'speciální potřeby', 'inkluze', 'podpora', 'přizpůsobení'] },
                { id: 'individualizace', title: 'Individualizace', keywords: ['individuální', 'přizpůsobení', 'úprava'] },
                { id: 'vizuální-podpora', title: 'Vizuální podpora', keywords: ['vizuální', 'obrázky', 'grafika', 'visual'] }
            ]
        },
        'novinky': {
            title: 'Co je nového',
            url: 'novinky.html',
            sections: [
                { id: 'updates', title: 'Novinky a updaty', keywords: ['novinky', 'nové', 'update', 'aktualizace', 'změny'] }
            ]
        }
    },

    // Studio moduly - kompletní seznam
    modules: {
        'audio-prehled': {
            title: 'Audio přehled',
            url: 'modules/audio-prehled.html',
            description: 'AI generovaný podcast (Audio Overview) z vašich zdrojů - ideální pro poslech při cestě nebo jako domácí příprava',
            sections: [
                { id: 'tips', title: 'Tipy pro Audio', keywords: ['audio', 'podcast', 'tipy', 'poslech'] },
                { id: 'use-cases', title: 'Use Cases - Audio', keywords: ['audio', 'příklady', 'použití'] },
                { id: 'top-use-cases', title: 'TOP 10 Audio Use Cases', keywords: ['audio', 'top', 'nejlepší', 'podcast'] }
            ],
            topUseCases: [
                'Domácí příprava žáků formou podcastu',
                'Opakování látky při cestě do školy',
                'Podcast pro rodiče o pokroku dítěte'
            ]
        },
        'video-prehled': {
            title: 'Video přehled',
            url: 'modules/video-prehled.html',
            description: 'AI generované video s animacemi vysvětlujícími vaše zdroje - perfektní pro flipované učení a vizuální výuku',
            sections: [
                { id: 'tips', title: 'Tipy pro Video', keywords: ['video', 'tipy', 'délka', 'animace'] },
                { id: 'video-metody', title: 'Metody pro fokusované video', keywords: ['video', 'zaměření', 'kontext', 'fokus'] },
                { id: 'use-cases', title: 'Praktické příklady', keywords: ['video', 'příklady'] },
                { id: 'top-use-cases', title: 'TOP 10 Video Use Cases', keywords: ['video', 'top', 'flipované učení', 'domácí příprava', 'vizualizace', 'flipped classroom'] }
            ],
            topUseCases: [
                'Flipované učení - video úvod',
                'Vysvětlení složitého procesu krok za krokem',
                'Vizualizace abstraktních konceptů',
                'Motivační úvod k novému tématu',
                'Shrnutí kapitoly',
                'Jazyková výuka s kontextem',
                'Historický přehled události',
                'Srovnání dvou jevů',
                'Tutoriál na složitý postup',
                'Video pro absentéry'
            ]
        },
        'karticky': {
            title: 'Výukové kartičky (Flashcards)',
            url: 'modules/karticky.html',
            description: 'Automaticky generované kartičky pro efektivní memorování a opakování látky',
            sections: [
                { id: 'tips', title: 'Tipy pro kartičky', keywords: ['kartičky', 'flashcards', 'memorování', 'učení', 'opakování'] },
                { id: 'use-cases', title: 'Use Cases - Kartičky', keywords: ['kartičky', 'příklady', 'slovíčka', 'pojmy'] },
                { id: 'top-use-cases', title: 'TOP 10 Flashcards Use Cases', keywords: ['kartičky', 'top', 'memorování'] }
            ],
            topUseCases: [
                'Slovíčka z cizích jazyků',
                'Historické události a data',
                'Chemické vzorce a rovnice'
            ]
        },
        'quiz': {
            title: 'Kvíz',
            url: 'modules/quiz.html',
            description: 'Automaticky generované kvízy a testy pro rychlé ověření znalostí',
            sections: [
                { id: 'tips', title: 'Tipy pro kvíz', keywords: ['kvíz', 'test', 'otázky', 'quiz', 'testing'] },
                { id: 'use-cases', title: 'Use Cases - Kvíz', keywords: ['kvíz', 'příklady', 'testování'] },
                { id: 'top-use-cases', title: 'TOP 10 Quiz Use Cases', keywords: ['kvíz', 'top', 'testování'] }
            ],
            topUseCases: [
                'Formativní hodnocení po hodině',
                'Domácí úkol s okamžitou zpětnou vazbou',
                'Rychlé opakování před testem'
            ]
        },
        'infografika': {
            title: 'Infografika',
            url: 'modules/infografika.html',
            description: 'Vizuální shrnutí informací - ideální pro plakáty do třídy a studijní materiály',
            sections: [
                { id: 'tips', title: 'Tipy pro infografiku', keywords: ['infografika', 'vizualizace', 'grafika', 'obrázek'] },
                { id: 'use-cases', title: 'Use Cases - Infografika', keywords: ['infografika', 'příklady', 'plakát'] },
                { id: 'top-use-cases', title: 'TOP 10 Infografika Use Cases', keywords: ['infografika', 'top', 'vizualizace'] }
            ],
            topUseCases: [
                'Plakát do třídy s klíčovými body',
                'Vizuální shrnutí kapitoly',
                'Timeline historických událostí'
            ]
        },
        'prezentace': {
            title: 'Prezentace',
            url: 'modules/prezentace.html',
            description: 'Automaticky generované prezentace - osnova pro váš výklad nebo sharing s kolegy',
            sections: [
                { id: 'tips', title: 'Tipy pro prezentaci', keywords: ['prezentace', 'slides', 'powerpoint', 'výklad'] },
                { id: 'use-cases', title: 'Use Cases - Prezentace', keywords: ['prezentace', 'příklady', 'slides'] },
                { id: 'top-use-cases', title: 'TOP 10 Prezentace Use Cases', keywords: ['prezentace', 'top', 'slides'] }
            ],
            topUseCases: [
                'Osnova živé hodiny',
                'Prezentace pro rodiče na třídní schůzce',
                'Sharing materiálů s kolegy'
            ]
        },
        'myslenkova-mapa': {
            title: 'Myšlenková mapa',
            url: 'modules/myslenkova-mapa.html',
            description: 'Vizuální zobrazení vztahů mezi koncepty - perfektní pro brainstorming a strukturování tématu',
            sections: [
                { id: 'tips', title: 'Tipy pro myšlenkovou mapu', keywords: ['myšlenková mapa', 'mindmap', 'mapa', 'brainstorming'] },
                { id: 'use-cases', title: 'Use Cases - Myšlenková mapa', keywords: ['mapa', 'příklady', 'vztahy'] },
                { id: 'top-use-cases', title: 'TOP 10 Myšlenková Mapa Use Cases', keywords: ['mapa', 'top', 'mindmap'] }
            ],
            topUseCases: [
                'Strukturování nového tématu pro žáky',
                'Brainstorming nápadů na projekt',
                'Vizualizace vztahů mezi pojmy'
            ]
        },
        'tabulka-dat': {
            title: 'Tabulka dat',
            url: 'modules/tabulka-dat.html',
            description: 'Strukturovaná data z vašich zdrojů - skvělé pro srovnání a výpisky',
            sections: [
                { id: 'tips', title: 'Tipy pro tabulku', keywords: ['tabulka', 'data', 'strukturovaná', 'tabulky', 'table'] },
                { id: 'use-cases', title: 'Use Cases - Tabulka', keywords: ['tabulka', 'příklady', 'data'] },
                { id: 'top-use-cases', title: 'TOP 10 Tabulka Use Cases', keywords: ['tabulka', 'top', 'data'] }
            ],
            topUseCases: [
                'Srovnání historických období',
                'Tabulka slovíček s překlady',
                'Výpisky z textu do přehledné formy'
            ]
        },
        'zpravy-prehled': {
            title: 'Zprávy (Messages/Reports)',
            url: 'modules/zpravy-prehled.html',
            description: 'Vytváří strukturované zprávy, shrnutí a reporty z vašich zdrojů - perfektní pro dokumentaci a sdílení poznatků',
            sections: [
                { id: 'tips', title: 'Tipy pro zprávy', keywords: ['zprávy', 'report', 'shrnutí', 'dokumentace'] },
                { id: 'use-cases', title: 'Use Cases - Zprávy', keywords: ['zprávy', 'příklady', 'dokumentace'] }
            ],
            topUseCases: [
                'Zpráva pro rodiče o pokroku žáka',
                'Shrnutí porady',
                'Report z projektu'
            ]
        },
        'chat-prompty': {
            title: 'Prompty pro chat',
            url: 'modules/chat-prompty.html',
            description: 'Hotové prompty pro chat v NotebookLM - kopírujte a používejte rovnou pro různé analýzy a výstupy',
            sections: [
                { id: 'prompty', title: '16 hotových promptů', keywords: ['prompty', 'chat', 'hotové', 'prompt', 'šablony'] }
            ],
            topUseCases: [
                '5 klíčových otázek z dokumentů',
                'Ultimátní prompt pro přednášky',
                'Analýza mezer v dokumentaci',
                'Syntéza konceptů'
            ]
        }
    },

    // Databáze promptů
    promptDatabases: {
        'audio-prompty': {
            title: 'Audio prompty',
            url: 'modules/audio-prompty.html',
            description: 'Databáze promptů pro audio overview s možností kopírování'
        },
        'video-prompty': {
            title: 'Video prompty',
            url: 'modules/video-prompty.html',
            description: 'Databáze promptů pro video overview s možností kopírování'
        },
        'infografika-prompty': {
            title: 'Infografika prompty',
            url: 'modules/infografika-prompty.html',
            description: 'Databáze promptů pro infografiku s možností kopírování'
        },
        'prezentace-prompty': {
            title: 'Prezentace prompty',
            url: 'modules/prezentace-prompty.html',
            description: 'Databáze promptů pro prezentace s možností kopírování'
        },
        'chat-prompty': {
            title: 'Chat prompty',
            url: 'modules/chat-prompty.html',
            description: '16 hotových promptů pro chat v NotebookLM s možností kopírování'
        }
    },

    // Rychlé odpovědi - rozšířené
    quickAnswers: {
        // Základní navigace
        'jak začít': {
            answer: 'Začít s NotebookLM je snadné! Stačí 3 kroky:\\n\\n1. Jděte na notebooklm.google.com\\n2. Vytvořte nový notebook\\n3. Nahrajte své dokumenty (PDF, text, web)\\n\\nPodrobný průvodce:',
            link: 'jak-zacit.html'
        },
        'začátek': {
            answer: 'Začít s NotebookLM je snadné! Stačí 3 kroky:\\n\\n1. Jděte na notebooklm.google.com\\n2. Vytvořte nový notebook\\n3. Nahrajte své dokumenty\\n\\nPodrobný průvodce:',
            link: 'jak-zacit.html'
        },
        'tutorial': {
            answer: 'Máme pro vás kompletní návod! Stačí 3 kroky:\\n\\n1. Registrace na notebooklm.google.com\\n2. Vytvoření notebook\\n3. Nahrání zdrojů\\n\\nPodrobný návod:',
            link: 'jak-zacit.html'
        },

        // Studio moduly
        'audio': {
            answer: 'Audio přehled (podcast) vytvoříte:\\n\\n1. Otevřete Studio\\n2. Klikněte na Audio Overview\\n3. Přizpůsobte prompt (volitelné)\\n4. Vygenerujte\\n\\n✅ Ideální pro: poslech při cestě, domácí přípravu žáků\\n\\nPodrobné informace + TOP 10 use cases:',
            link: 'modules/audio-prehled.html#top-use-cases'
        },
        'podcast': {
            answer: 'Podcast z vašich zdrojů vytvoříte pomocí Audio Overview:\\n\\n✅ 2 AI hlasy diskutují o vašem obsahu\\n✅ Trvá 5-15 minut\\n✅ Můžete upravit zaměření pomocí promptu\\n\\nNávod a use cases:',
            link: 'modules/audio-prehled.html#top-use-cases'
        },
        'video': {
            answer: 'Video přehled nabízí:\\n\\n✅ Flipované učení\\n✅ Vizualizace složitých procesů\\n✅ Motivační úvody\\n✅ Video pro absentéry\\n✅ Animované vysvětlení\\n\\nMáme pro vás **TOP 10 video use cases**:',
            link: 'modules/video-prehled.html#top-use-cases'
        },
        'flipované učení': {
            answer: 'Flipované učení (Flipped Classroom) je TOP use case pro Video:\\n\\n✅ Žáci sledují video doma\\n✅ Hodina = diskuse a praxe\\n✅ Šetří čas ve výuce\\n\\nKompletní návod:',
            link: 'modules/video-prehled.html#top-use-cases'
        },
        'flipped': {
            answer: 'Flipped Classroom je skvělé pro Video přehled:\\n\\n✅ Video úvod k tématu\\n✅ Žáci si ho pustí doma\\n✅ Hodina = aktivní učení\\n\\nNávod:',
            link: 'modules/video-prehled.html#top-use-cases'
        },

        // Ostatní moduly
        'flashcards': {
            answer: 'Flashcards (kartičky) jsou skvělé pro:\\n\\n✅ Memorování slovíček\\n✅ Opakování látky\\n✅ Přípravu na testy\\n✅ Učení pojmů\\n\\nPodrobný návod a use cases:',
            link: 'modules/karticky.html#use-cases'
        },
        'kartičky': {
            answer: 'Flashcards (kartičky) jsou skvělé pro:\\n\\n✅ Memorování slovíček\\n✅ Opakování látky\\n✅ Přípravu na testy\\n✅ Historická data\\n✅ Chemické vzorce\\n\\nPodrobný návod:',
            link: 'modules/karticky.html#use-cases'
        },
        'quiz': {
            answer: 'Kvíz můžete použít pro:\\n\\n✅ Rychlé testování\\n✅ Formativní hodnocení\\n✅ Opakování látky\\n✅ Domácí úkol s feedbackem\\n\\nPodrobný návod a use cases:',
            link: 'modules/quiz.html#use-cases'
        },
        'kvíz': {
            answer: 'Kvíz použijete pro:\\n\\n✅ Rychlé testování po hodině\\n✅ Formativní hodnocení\\n✅ Opakování před testem\\n\\nPodrobný návod:',
            link: 'modules/quiz.html#use-cases'
        },
        'test': {
            answer: 'Pro testování je skvělý modul Quiz:\\n\\n✅ Automaticky generované otázky\\n✅ Okamžitá zpětná vazba\\n✅ Různé typy otázek\\n\\nNávod:',
            link: 'modules/quiz.html#use-cases'
        },
        'infografika': {
            answer: 'Infografika je ideální pro:\\n\\n✅ Vizuální shrnutí\\n✅ Plakáty do třídy\\n✅ Studijní materiály\\n✅ Timeline události\\n\\nPodrobný návod a use cases:',
            link: 'modules/infografika.html#use-cases'
        },
        'prezentace': {
            answer: 'Prezentace použijete pro:\\n\\n✅ Osnovu živé hodiny\\n✅ Sharing s kolegy\\n✅ Třídní schůzku\\n✅ Konference\\n\\nPodrobný návod a use cases:',
            link: 'modules/prezentace.html#use-cases'
        },
        'powerpoint': {
            answer: 'NotebookLM generuje prezentace (slides) pomocí modulu Prezentace:\\n\\n✅ Automatická osnova\\n✅ Klíčové body\\n✅ Export možný\\n\\nNávod:',
            link: 'modules/prezentace.html#use-cases'
        },
        'slides': {
            answer: 'Slides vytvoříte pomocí modulu Prezentace:\\n\\n✅ AI vygeneruje osnovu\\n✅ Použijete pro výklad\\n✅ Sdílíte s kolegy\\n\\nNávod:',
            link: 'modules/prezentace.html#use-cases'
        },
        'myšlenková mapa': {
            answer: 'Myšlenková mapa pomáhá:\\n\\n✅ Pochopit vztahy mezi koncepty\\n✅ Brainstorming nápadů\\n✅ Strukturovat téma\\n✅ Vizualizovat komplexní informace\\n\\nPodrobný návod:',
            link: 'modules/myslenkova-mapa.html#use-cases'
        },
        'mindmap': {
            answer: 'Mindmap (myšlenková mapa) je skvělá pro:\\n\\n✅ Strukturování tématu\\n✅ Brainstorming\\n✅ Vizualizaci vztahů\\n\\nNávod:',
            link: 'modules/myslenkova-mapa.html#use-cases'
        },
        'mapa': {
            answer: 'Myšlenková mapa zobrazí:\\n\\n✅ Vztahy mezi pojmy\\n✅ Hierarchii informací\\n✅ Komplexní strukturu\\n\\nNávod:',
            link: 'modules/myslenkova-mapa.html#use-cases'
        },
        'tabulka': {
            answer: 'Tabulka dat je skvělá pro:\\n\\n✅ Strukturování informací\\n✅ Srovnání dat\\n✅ Výpisky z textu\\n✅ Přehledné uspořádání\\n\\nPodrobný návod:',
            link: 'modules/tabulka-dat.html#use-cases'
        },
        'table': {
            answer: 'Table (tabulka) je ideální pro:\\n\\n✅ Srovnání více věcí\\n✅ Strukturování dat\\n✅ Přehledné výpisky\\n\\nNávod:',
            link: 'modules/tabulka-dat.html#use-cases'
        },

        // Studio obecně
        'studio': {
            answer: 'Studio je panel s 8 nástroji:\\n\\n🎧 Audio přehled\\n🎥 Video\\n🧠 Myšlenková mapa\\n🃏 Flashcards\\n❓ Quiz\\n📊 Infografika\\n📽️ Prezentace\\n📋 Tabulka dat\\n\\nVíce o Studio:',
            link: 'index.html#studio-moduly'
        },
        'moduly': {
            answer: 'Studio moduly nabízí 8 výstupních formátů:\\n\\n🎧 Audio\\n🎥 Video\\n🃏 Kartičky\\n❓ Quiz\\n📊 Infografika\\n📽️ Prezentace\\n🧠 Mapa\\n📋 Tabulka\\n\\nPřehled:',
            link: 'index.html#studio-moduly'
        },

        // Use Cases
        'use case': {
            answer: 'Máme připravených **189 use cases** pro učitele!\\n\\nKategorie:\\n✅ Příprava výuky\\n✅ Hodnocení\\n✅ Administrativa\\n✅ SPU & ADHD\\n✅ Kreativní projekty\\n✅ Všechny studio moduly\\n\\nProhlédněte si je:',
            link: 'use-cases.html'
        },
        'příklady': {
            answer: 'Máme 189 konkrétních příkladů použití!\\n\\n📚 Podle kategorie\\n🎬 Podle modulu\\n🎯 S hotovými prompty\\n\\nPříklady:',
            link: 'use-cases.html'
        },
        'prompty': {
            answer: 'Všechny use cases obsahují hotové prompty!\\n\\n✅ Kopírovat & vložit\\n✅ Přizpůsobit si\\n✅ Okamžitě použít\\n\\n189 promptů:',
            link: 'use-cases.html'
        },

        // SPU & ADHD
        'spu': {
            answer: 'Máme speciální sekci pro práci s žáky se SPU a ADHD:\\n\\n✅ Přizpůsobené materiály\\n✅ Vizuální podpora\\n✅ Strukturované výstupy\\n✅ Individualizace\\n✅ Multimodální přístup\\n\\nVíce informací:',
            link: 'spu-adhd.html'
        },
        'adhd': {
            answer: 'Pro žáky s ADHD máme specifické nástroje:\\n\\n✅ Kratší formáty (audio, video)\\n✅ Vizuální podpora\\n✅ Strukturované materiály\\n✅ Jasné instrukce\\n\\nNávod:',
            link: 'spu-adhd.html'
        },
        'inkluze': {
            answer: 'Inclusive teaching s NotebookL M:\\n\\n✅ Multimodální výstupy\\n✅ Přizpůsobení pro SPU\\n✅ Vizuální podpory\\n\\nVíce:',
            link: 'spu-adhd.html'
        },
        'individualizace': {
            answer: 'NotebookLM umožňuje individualizaci:\\n\\n✅ Různé formáty výstupů\\n✅ Přizpůsobené úrovni žáka\\n✅ Specifické potřeby\\n\\nNávod:',
            link: 'spu-adhd.html'
        },

        // Troubleshooting
        'problém': {
            answer: 'Narazili jste na problém? Podívejte se do troubleshooting sekce:\\n\\n✅ Časté chyby a řešení\\n✅ Limitace NotebookLM\\n✅ Tipy a triky\\n✅ Workaroundy\\n\\nTroubleshooting:',
            link: 'troubleshooting.html'
        },
        'chyba': {
            answer: 'Setkali jste s chybou? Check troubleshooting:\\n\\n✅ Časté chyby\\n✅ Řešení problémů\\n✅ Tipy jak obejít limitace\\n\\nTroubleshooting:',
            link: 'troubleshooting.html'
        },
        'nefunguje': {
            answer: 'Něco nefunguje? Zkuste troubleshooting:\\n\\n✅ Časté problémy a řešení\\n✅ Limitace platformy\\n✅ Alternativní postupy\\n\\nPomoc:',
            link: 'troubleshooting.html'
        },
        'limit': {
            answer: 'NotebookLM má některá omezení:\\n\\n⚠️ Max velikost souboru\\n⚠️ Počet zdrojů\\n⚠️ Jazyk (primárně EN)\\n\\nVšechna omezení + jak je obejít:',
            link: 'troubleshooting.html'
        },

        // Novinky
        'novinky': {
            answer: 'Sledujte novinky a updaty NotebookLM:\\n\\n🆕 Nové funkce\\n📢 Oznámení\\n🔄 Změny v platformě\\n\\nCo je nového:',
            link: 'novinky.html'
        },
        'update': {
            answer: 'Aktuální updaty NotebookLM:\\n\\n🆕 Nové moduly\\n🔄 Vylepšení\\n📢 Změny\\n\\nNovinky:',
            link: 'novinky.html'
        },

        // Další užitečné
        'příprava': {
            answer: 'Příprava výuky s NotebookLM:\\n\\n✅ 60+ use cases\\n✅ Ušetřete hodiny času\\n✅ Hotové prompty\\n\\nUse cases pro přípravu:',
            link: 'use-cases.html#priprava'
        },
        'hodnocení': {
            answer: 'Hodnocení žáků s NotebookLM:\\n\\n✅ Automatické kvízy\\n✅ Rubrics pro hodnocení\\n✅ Zpětná vazba\\n\\nUse cases:',
            link: 'use-cases.html#hodnoceni'
        },
        'administrativa': {
            answer: 'Administrativa s NotebookLM:\\n\\n✅ Zprávy pro rodiče\\n✅ Dokumentace\\n✅ Plány\\n\\nUse cases:',
            link: 'use-cases.html#admin'
        },
        'chat': {
            answer: 'Chat s NotebookLM funguje jako AI asistent:\\n\\n✅ Ptejte se na obsah dokumentů\\n✅ Generujte shrnutí\\n✅ Získejte odpovědi s citacemi\\n\\nVíce o chatu:',
            link: 'index.html#chat'
        },
        'citace': {
            answer: 'NotebookLM vždy cituje zdroje:\\n\\n✅ Odkaz na konkrétní místo\\n✅ Ověřitelné informace\\n✅ Transparentnost\\n\\nO citacích:',
            link: 'index.html#citace'
        }
    }
};
