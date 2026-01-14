// Databáze promptů pro Infografiku (Fallback data)
const INFOGRAFIKA_PROMPTS = [
    {
        id: "info-1",
        number: 1,
        title: "Základní vizualizace dat",
        category: "Data & Statistiky",
        icon: "📊",
        prompt: "Vytvoř návrh infografiky pro téma 'Výsledky prodeje Q1'. Hlavní body: nárůst obratu o 15%, 3 nové trhy, top produkt 'NotebookLM'. Použij sloupcový graf pro porovnání s minulým rokem a koláčový graf pro podíl na trhu. Styl: Profesionální, modrá barevná paleta.",
        image_url: null
    },
    {
        id: "info-2",
        number: 2,
        title: "Časová osa projektu",
        category: "Čas & Termíny",
        icon: "⏱️",
        prompt: "Navrhni vizuální časovou osu pro projekt 'Implementace AI ve výuce'. Fáze: 1. Příprava (Leden), 2. Školení (Únor), 3. Pilotní provoz (Březen), 4. Vyhodnocení (Duben). Pro každou fázi navrhni ikonu a krátký popis. Styl: Lineární layout, moderní design.",
        image_url: null
    },
    {
        id: "info-3",
        number: 3,
        title: "SWOT Analýza",
        category: "Cíle & Strategie",
        icon: "🎯",
        prompt: "Vytvoř strukturu pro SWOT analýzu 'Zavedení digitálních učebnic'. Silné stránky: interaktivita, aktuálnost. Slabé stránky: závislost na technice. Příležitosti: personalizace výuky. Hrozby: kyberbezpečnost. Rozděl do 4 kvadrantů s barevným odlišením.",
        image_url: null
    },
    {
        id: "info-4",
        number: 4,
        title: "Hierarchie potřeb",
        category: "Vzdělávání",
        icon: "🎓",
        prompt: "Navrhni infografiku ve tvaru pyramidy zobrazující Maslowovu hierarchii potřeb aplikovanou na motivaci studentů. Základna: Fyzické bezpečí (teplo, klid). Střed: Sounáležitost (týmová práce). Vrchol: Seberealizace (kreativní projekty).",
        image_url: null
    },
    {
        id: "info-5",
        number: 5,
        title: "Porovnání produktů",
        category: "Finance & Business",
        icon: "💰",
        prompt: "Vytvoř srovnávací tabulku/infografiku pro 'Premium vs Standard' účet. 5 klíčových funkcí (úložiště, podpora, analytika, export, API). Použij 'zaškrtávátka' a 'křížky' pro jasné srovnání. Zvýrazni Premium variantu jako doporučenou.",
        image_url: null
    },
    {
        id: "info-6",
        number: 6,
        title: "Myšlenková mapa konceptu",
        category: "Nápady & Inspirace",
        icon: "💡",
        prompt: "Vizualizuj propojení témat v 'Udržitelnosti'. Centrální uzel: Udržitelnost. Větve: Ekologie (recyklace, energie), Ekonomika (cirkulární, úspory), Společnost (komunity, vzdělávání). Navrhni ikony pro každou větev.",
        image_url: null
    },
    {
        id: "info-7",
        number: 7,
        title: "Procesní diagram",
        category: "Růst & Progress",
        icon: "📈",
        prompt: "Vytvoř flowchart pro 'Nábor nového zaměstnance'. Kroky: 1. Inzerát -> 2. Screening CV -> 3. Pohovor -> 4. Rozhodnutí (ANO/NE) -> 5. Onboarding. Použij standardní tvary pro procesy (kosočtverec pro rozhodnutí).",
        image_url: null
    },
    {
        id: "info-8",
        number: 8,
        title: "Geografické rozložení",
        category: "Geografie & Mapy",
        icon: "🌍",
        prompt: "Navrhni mapovou infografiku 'Pobočky v ČR'. Zvýrazni kraje s pobočkami (Praha, Brno, Ostrava). Použij piny s počtem zaměstnanců. Legenda: Tmavě modrá = centrála, Světle modrá = pobočka.",
        image_url: null
    },
    {
        id: "info-9",
        number: 9,
        title: "Vědecký cyklus",
        category: "Věda & Výzkum",
        icon: "🔬",
        prompt: "Zobraz cyklický proces 'Vědecké metody': Pozorování -> Hypotéza -> Experiment -> Analýza -> Závěr. Použij kruhový diagram se šipkami. Styl: Čistý, laboratorní, bílé pozadí.",
        image_url: null
    },
    {
        id: "info-10",
        number: 10,
        title: "Certifikace a ocenění",
        category: "Úspěch & Ocenění",
        icon: "🏆",
        prompt: "Vytvoř 'Wall of Fame' infografiku. Zobraz 3 získané certifikáty (ISO, Eco-Label, Top Employer). Každý s ikonou pečeti a rokem získání. Zlaté a stříbrné akcenty.",
        image_url: null
    }
    // Místo pro dalších 23 promptů...
];
