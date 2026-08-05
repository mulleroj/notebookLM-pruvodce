# Údržba obsahu NotebookLM

Proměnlivé produktové informace jsou v `gemini-notebook-product-info.js`. Obsahuje datum, názvy a odkazy na oficiální nápovědu a vykresluje aktuální veřejný obsah hlavních rout. Neměňte limity ručně v jednotlivých HTML stránkách.

## Aktualizace

1. Ověřte změnu v [nápovědě NotebookLM](https://support.google.com/notebooklm/) nebo ve službě Google Workspace Updates.
2. Zapište datum ověření a odkaz do centrálního souboru.
3. Uveďte stav: obecně dostupné, postupně zaváděné, experimentální nebo omezené tarifem.
4. Při nové funkci doplňte popis do příslušné route a odkaz na oficiální zdroj; nejde-li funkci ověřit, formulaci změkčete nebo ji nepublikujte.
5. Do Novinek přidejte datum oznámení, datum dostupnosti (liší-li se), platformu, tarif, jazyk, stav a oficiální odkaz.

## Kontroly

Spusťte `node --test tests/content-audit.test.js` a `node --test tests/*.test.js`, poté `node scripts/build-production.js`. Před vydáním otevřete hlavní stránku, Jak začít, Novinky, všechny aktualizované moduly, Řešení problémů a SPU/ADHD na desktopu i úzké šířce.

Kontrolu opakujte alespoň jednou za čtvrtletí a vždy po oficiálním oznámení Google. U tarifů, limitů, mobilu a experimentálních funkcí ji opakujte před každým vydáním.
