/**
 * Knowledge base for the Gemini Notebook guide. The old product name remains
 * only in search keywords and official URLs that have not yet been renamed.
 */
window.CHATBOT_KNOWLEDGE = {
    pages: {
        index: { title: 'Gemini Notebook', url: 'index.html', sections: [
            { id: 'uvod', title: 'Úvod', keywords: ['začít', 'úvod', 'gemini notebook', 'notebooklm'] },
            { id: 'studio-moduly', title: 'Studio', keywords: ['studio', 'moduly', 'výstupy'] },
            { id: 'chat', title: 'Chat s Gemini Notebook', keywords: ['chat', 'konverzace'] },
            { id: 'citace', title: 'Citace a kontrola zdrojů', keywords: ['citace', 'zdroje', 'odkazy'] }
        ] },
        'jak-zacit': { title: 'Jak začít', url: 'jak-zacit.html', sections: [
            { id: 'krok-za-krokem', title: 'První kroky', keywords: ['začít', 'návod', 'registrace', 'zdroje'] }
        ] },
        'use-cases': { title: 'Praktické postupy', url: 'use-cases.html', sections: [
            { id: 'priprava', title: 'Příprava výuky', keywords: ['příprava', 'výuka'] },
            { id: 'hodnoceni', title: 'Hodnocení', keywords: ['hodnocení', 'testy', 'kvíz'] },
            { id: 'admin', title: 'Administrativa', keywords: ['administrativa', 'zprávy'] },
            { id: 'spu', title: 'SPU a ADHD', keywords: ['spu', 'adhd', 'inkluze'] }
        ] },
        troubleshooting: { title: 'Troubleshooting', url: 'troubleshooting.html', sections: [
            { id: 'chyby', title: 'Časté problémy', keywords: ['chyba', 'problém', 'limit'] }
        ] },
        novinky: { title: 'Ověřené změny', url: 'novinky.html', sections: [
            { id: 'overene', title: 'Ověřené změny', keywords: ['novinky', 'aktualizace', 'změny'] }
        ] }
    },
    modules: {
        'audio-prehled': { title: 'Audio přehled', url: 'modules/audio-prehled.html', description: 'Audio výstup ze zvolených zdrojů; dostupné volby a délka se mohou lišit podle účtu.', sections: [{ id: 'top-use-cases', title: 'Praktické postupy', keywords: ['audio', 'podcast'] }] },
        'video-prehled': { title: 'Video přehled', url: 'modules/video-prehled.html', description: 'Video výstup ze zvolených zdrojů; obsah před použitím zkontrolujte.', sections: [{ id: 'top-use-cases', title: 'Praktické postupy', keywords: ['video'] }] },
        karticky: { title: 'Výukové kartičky', url: 'modules/karticky.html', description: 'Kartičky ze zdrojů je vhodné projít a upravit pro konkrétní skupinu žáků.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['kartičky', 'flashcards'] }] },
        quiz: { title: 'Kvíz', url: 'modules/quiz.html', description: 'Kvíz může navrhnout otázky ze zdrojů; správnost, klíč i přiměřenost kontroluje učitel.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['kvíz', 'test'] }] },
        infografika: { title: 'Infografika', url: 'modules/infografika.html', description: 'Vizuální výstup ze zdrojů; ověřte text, čísla, kontrast a čitelnost.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['infografika'] }] },
        prezentace: { title: 'Prezentace', url: 'modules/prezentace.html', description: 'Studio může podle dostupné verze vytvořit prezentaci nebo slide deck; možnosti exportu ověřte v rozhraní.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['prezentace', 'slides', 'powerpoint'] }] },
        'myslenkova-mapa': { title: 'Myšlenková mapa', url: 'modules/myslenkova-mapa.html', description: 'Vizuální přehled vztahů mezi pojmy ve zvolených zdrojích.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['mapa', 'mindmap'] }] },
        'tabulka-dat': { title: 'Tabulka dat', url: 'modules/tabulka-dat.html', description: 'Strukturovaný přehled ze zdrojů; čísla a závěry ověřte v podkladech.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['tabulka', 'data'] }] },
        'zpravy-prehled': { title: 'Zprávy', url: 'modules/zpravy-prehled.html', description: 'Návrhy strukturovaných zpráv a shrnutí ze zdrojů vyžadují redakční kontrolu.', sections: [{ id: 'use-cases', title: 'Praktické postupy', keywords: ['zprávy', 'report'] }] },
        'chat-prompty': { title: 'Prompty pro chat', url: 'modules/chat-prompty.html', description: 'Prompty pro chat v Gemini Notebook; před použitím je přizpůsobte svým zdrojům.', sections: [{ id: 'prompty', title: 'Prompty', keywords: ['prompty', 'chat'] }] }
    },
    promptDatabases: {},
    quickAnswers: {
        'jak začít': { answer: 'Začít s Gemini Notebook (dříve NotebookLM) můžete na notebooklm.google.com: vytvořte notebook, přidejte zdroje a ověřte nastavení účtu.\n\nPodrobný průvodce:', link: 'jak-zacit.html' },
        'začátek': { answer: 'Začít s Gemini Notebook můžete vytvořením notebooku a přidáním vlastních zdrojů.\n\nPodrobný průvodce:', link: 'jak-zacit.html' },
        tutorial: { answer: 'První kroky v Gemini Notebook najdete v průvodci; adresa notebooklm.google.com může během přechodu používat původní název.', link: 'jak-zacit.html' },
        audio: { answer: 'Audio přehled vytvoříte ve Studiu ze zvolených zdrojů. Volby, jazyk a délka se mohou lišit podle účtu; výsledek zkontrolujte.\n\nNávod:', link: 'modules/audio-prehled.html#top-use-cases' },
        podcast: { answer: 'Audio přehled v Gemini Notebook může shrnout zvolené zdroje. Dostupné styly a délka nejsou garantované; ověřte je v rozhraní.\n\nNávod:', link: 'modules/audio-prehled.html#top-use-cases' },
        video: { answer: 'Video přehled pracuje se zvolenými zdroji. Před sdílením ověřte fakta, titulky a přiměřenost pro žáky.\n\nNávod:', link: 'modules/video-prehled.html#top-use-cases' },
        prezentace: { answer: 'Gemini Notebook může podle dostupné verze Studia vytvořit prezentaci nebo slide deck. Obsah, citace a dostupné exporty ověřte v rozhraní.\n\nNávod:', link: 'modules/prezentace.html#use-cases' },
        prezentaci: { answer: 'Gemini Notebook může podle dostupné verze Studia vytvořit prezentaci nebo slide deck. Obsah, citace a dostupné exporty ověřte v rozhraní.\n\nNávod:', link: 'modules/prezentace.html#use-cases' },
        powerpoint: { answer: 'Pro prezentaci použijte Studio a ověřte, které výstupy a exporty nabízí váš účet. Před použitím zkontrolujte každý slide.\n\nNávod:', link: 'modules/prezentace.html#use-cases' },
        quiz: { answer: 'Kvíz může navrhnout otázky ze zdrojů. Učitel musí zkontrolovat správnost odpovědí, formulaci i vhodnost pro danou skupinu.\n\nNávod:', link: 'modules/quiz.html#use-cases' },
        hodnocení: { answer: 'Gemini Notebook může pomoci připravit podklady pro hodnocení, nikoli ho automaticky rozhodnout. Závěr, kritéria a zpětnou vazbu kontroluje učitel.\n\nPraktické postupy:', link: 'use-cases.html#hodnoceni' },
        hodnotit: { answer: 'Gemini Notebook může pomoci připravit podklady pro hodnocení, nikoli ho automaticky rozhodnout. Závěr, kritéria a zpětnou vazbu kontroluje učitel.\n\nPraktické postupy:', link: 'use-cases.html#hodnoceni' },
        limity: { answer: 'Limity Gemini Notebook se liší podle účtu, tarifu, zdrojů a postupného zavádění. Aktuální stav ověřte v rozhraní a oficiální nápovědě.\n\nTroubleshooting:', link: 'troubleshooting.html' },
        limit: { answer: 'Limity Gemini Notebook se liší podle účtu, tarifu a typu zdroje. Neuvádíme univerzální pevné počty ani jazyková omezení.\n\nTroubleshooting:', link: 'troubleshooting.html' },
        novinky: { answer: 'Ověřené změny Gemini Notebook najdete v přehledu s odkazy na oficiální zdroje Google.\n\nNovinky:', link: 'novinky.html' },
        nového: { answer: 'Ověřené změny Gemini Notebook najdete v přehledu s odkazy na oficiální zdroje Google.\n\nNovinky:', link: 'novinky.html' },
        update: { answer: 'Aktuální změny Gemini Notebook ověřujte v rozhraní a v oficiální nápovědě; dostupnost se může lišit.\n\nNovinky:', link: 'novinky.html' },
        příprava: { answer: 'Příprava výuky s Gemini Notebook může vycházet z vašich zdrojů. Návrhy upravte a ověřte před použitím ve třídě.\n\nPraktické postupy:', link: 'use-cases.html#priprava' },
        administrativa: { answer: 'Gemini Notebook může pomoci s návrhem zpráv a podkladů. Citlivé údaje chraňte a finální text zkontrolujte.\n\nPraktické postupy:', link: 'use-cases.html#admin' },
        chat: { answer: 'Chat v Gemini Notebook pracuje se zvolenými zdroji. Ptejte se konkrétně a závěry porovnávejte s původními podklady.\n\nVíce o chatu:', link: 'index.html#chat' },
        citace: { answer: 'Gemini Notebook může u odpovědí zobrazit odkazy na části zdrojů. Citace pomáhají dohledat podklad, ale nezaručují správnou ani úplnou interpretaci; učitel kontroluje závěr i původní zdroj.\n\nVíce o citacích:', link: 'index.html#citace' }
    }
};
