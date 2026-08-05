# Obsahový audit: Gemini Notebook (dříve NotebookLM) — srpen 2026

Stav: redakční opravy jsou přímo ve zdrojovém HTML; produkční build pouze přidává společný status box a odkazy na zdroje. Aktuální veřejný název je Gemini Notebook. Google produkt 16. července 2026 přejmenoval z NotebookLM na Gemini Notebook; starší název zůstává pouze v historickém kontextu, URL a názvech dosud nepřejmenované nápovědy.

| Stránka / soubor | Původní tvrzení | Stav | Oprava |
|---|---|---|---|
| `index.html` | počítadla, pevné počty modulů a zdrojů, citace jako důkaz | zastaralé / rozporné | Přechodový název Gemini Notebook (dříve NotebookLM), bez počítadel, vysvětlení limitů citací a aktuální model zdrojů a Studia. |
| `jak-zacit.html` | produkt popsaný jen jako chat nad dokumenty | neúplné | Postup pro výběr zdrojů, chat, Studio a bezpečnost školních dat. |
| `modules/audio-prehled.html` | dva hlasy a pevné délky | nedoložené | Proměnlivá nabídka, orientační délka, mobilní/offline audio a kontrola výslovnosti. |
| `modules/video-prehled.html` | pevná délka a automatické použití chatu | nedoložené | Nastavení zdrojů přímo u výstupu, kontrola videa, mobilní dostupnost podle účtu. |
| `modules/prezentace.html` | pouze osnova pro Gamma/PowerPoint | zastaralé | Přímá tvorba Slide Decku, kontrola obsahu; PPTX není tvrzen bez potvrzení. |
| `modules/infografika.html` | pouze prompt pro Midjourney/DALL-E | zastaralé | Přímá infografika, praktická rizika češtiny, kontrastu a tisku. |
| `modules/tabulka-dat.html` | neurčené exporty a výpočty | nedoložené | Syntéza ze zdrojů, export do Google Sheets a povinná kontrola čísel. |
| `modules/karticky.html`, `modules/quiz.html` | hotový výukový výstup bez podmínek | příliš silné | Kontrola klíče, ambiguity, dostupnosti a zdrojové opory. |
| `modules/myslenkova-mapa.html`, `modules/zpravy-prehled.html` | neověřené pracovní názvy/funkce | neúplné | Potvrzené možnosti, hranice mobilu a exportu. |
| `troubleshooting.html` | 2 zdroje, 500 slov, 10 souborů | nedoložené | Diagnostika podle tarifu, importu, synchronizace, limitu a platformy. |
| `spu-adhd.html` | zobecňující formulace | nevhodné | Individuální pedagogické postupy, přístupnost, ochrana citlivých dat. |
| `use-cases.html` | marketingové počitadlo a nerealistické sliby | rozporné | Typologie postupů a podmínka učitelské kontroly. |
| `novinky.html`, archiv Lecture Mode | neověřený aktuální režim | nedoložené | Changelogový rámec a odstranění tvrzení o potvrzeném samostatném režimu z veřejného obsahu. |

## Ověřené zdroje

- [NotebookLM is now Gemini Notebook](https://blog.google/innovation-and-ai/products/gemini-notebook/notebooklm-gemini-notebook/) — oficiální oznámení Google z 16. července 2026
- [Learn about NotebookLM](https://support.google.com/notebooklm/answer/16164461)
- [Create a notebook in NotebookLM](https://support.google.com/notebooklm/answer/16206563)
- [Add or discover sources](https://support.google.com/notebooklm/answer/16215270)
- [Frequently asked questions](https://support.google.com/notebooklm/answer/16269187)
- [NotebookLM mobile app](https://support.google.com/notebooklm/answer/16296687)
- [Mind maps](https://support.google.com/notebooklm/answer/16212283)

## Neověřené oblasti

Konkrétní limity placených plánů, kompletní seznam exportů pro Slide Deck a infografiku, přesné denní limity jednotlivých artefaktů, regionální dostupnost a všechny experimentální režimy nejsou bez živého účtu bezpečně obecné. Web je proto netvrdí jako univerzální fakta.

## Post-merge redakční doplnění

| Stránka | Zastaralý blok | Oprava | Typ workflow | Zdroj / nejistota |
|---|---|---|---|---|
| `modules/prezentace.html` | osnova pro Gamma/PowerPoint jako jediný výsledek | nativní prezentace/slide deck, kontrola snímků; externí editace jen volitelně | nativní + volitelný externí | Google Help: Create a notebook; export Slide Decku závisí na aktuálním rozhraní |
| `modules/infografika.html` | prompt pro Midjourney/DALL-E jako definice modulu | přímá infografika ve Studiu a samostatně označený externí postup | nativní + volitelný externí | Google Help: Create a notebook; styly/export se liší podle účtu |
| `novinky.html` | neověřený Lecture Mode, roadmap a pevné limity | opatrný rozcestník k datovaným oficiálním zdrojům, bez tvrzení o univerzální dostupnosti | nativní informace | aktuální úplný changelog není bez průběžného ověření garantován |

Všechny ostatní auditované routy byly znovu projity na absolutní tvrzení, pevné limity, garance délek, počet hlasů, povinný chat před Studiem a neověřené exporty. Neověřené detaily jsou formulovány jako závislé na účtu nebo odkázány na nápovědu Google.
