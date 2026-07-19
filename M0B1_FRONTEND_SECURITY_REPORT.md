# M0B1 — Frontendová a deploy stabilizace

## Rozsah

Milník odstraňuje potvrzená frontendová a deploy rizika nezávislá na Supabase RLS. Nemění databázové operace, datový model, produktový obsah ani RLS politiky.

## Změněné soubory

- `supabase-config.js` — odstranění osmi localhost ingest požadavků.
- `chatbot.js` — bezpečný DOM renderer zpráv, URL validace a odstranění inline handlerů.
- `app.js` — bezpečné vykreslení uživatelských zpráv v dormantním chatu a DOM konstrukce code blocku.
- `netlify.toml` — build do `dist`, cache revalidace, bezpečnostní hlavičky a skutečná 404 stránka.
- `404.html` — obecná bezpečná chybová stránka.
- `scripts/build-production.js` — deterministický produkční allowlist.
- `tests/security.test.js` — XSS a URL regresní testy.
- `tests/build.test.js` — publish allowlist, localhost a Netlify config testy.
- `tests/internal-assets.test.js` — kontrola interních script/stylesheet cest.
- `tests/http-smoke.js` — lokální HTTP smoke test veřejných a neveřejných cest.
- `M0B1_FRONTEND_SECURITY_REPORT.md` — tento report.

## Odstraněné localhost requesty

Ze `getInfografikaPromptsFromSupabase()` bylo odstraněno všech osm `POST` požadavků na `127.0.0.1:7242`, včetně bezprostředně souvisejících `agent log` bloků. Skutečný Supabase `SELECT`, fallback a mapování promptů zůstaly beze změny.

## Oprava chatbot XSS

Aktivní `chatbot.js` již nevkládá zprávy přes `innerHTML` ani `insertAdjacentHTML`. UI, welcome suggestions, zprávy i typing indicator vytváří pomocí `document.createElement`, `textContent`, `append` a `addEventListener`.

Bezpečný renderer podporuje:

- běžný text a odstavce,
- odrážkové a číslované seznamy,
- `**tučný text**`,
- Markdown odkazy.

HTML tagy a event handlery z uživatelských i bot zpráv zůstávají textem. Dormantní `app.js` používá pro uživatelské zprávy samostatný `textContent` tok; interní statické UI šablony zůstávají explicitně označené jako trusted, aby se nezměnil jejich funkční účel.

## Validace URL

Každý Markdown odkaz se parsuje pomocí `new URL()`. Aktivní odkaz vznikne pouze pro výsledný protokol `https:` nebo `http:`. Relativní interní odkazy se nejprve bezpečně vyřeší proti aktuální HTTP(S) stránce. `javascript:`, `data:`, `vbscript:` a neplatné URL se zobrazí jako text. Externí odkazy používají `target="_blank"` a `rel="noopener noreferrer"`.

## Produkční allowlist

Netlify nyní spouští:

```text
node scripts/build-production.js
```

a publikuje pouze `dist/`. Skript před každým buildem bezpečně vyčistí výhradně `dist` uvnitř projektu a kopíruje explicitní seznam:

- veřejné kořenové HTML/CSS/JS,
- 15 aktivních modulových HTML stránek,
- `assets/`,
- `novinky/`,
- obecnou `404.html`.

Do `dist` se nekopírují testovací a diagnostické stránky, backupy, vývojové šablony, Python/PowerShell utility, logy, TXT ani interní Markdown dokumentace. Build aktuálně vytváří 66 souborů.

## Cache pravidla

- HTML, nehashovaný JavaScript a CSS: `public, max-age=0, must-revalidate`.
- Obrázky v `assets/`: `public, max-age=86400`, bez dlouhé neměnné cache.
- Roční cache pro nehashované soubory byla odstraněna.

## Bezpečnostní hlavičky

Zachovány jsou `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` a stávající platformní HSTS. Doplněno:

```text
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
```

CSP je pouze `Content-Security-Policy-Report-Only`. Inventura zahrnuje Google Fonts, jsDelivr Supabase klienta, Supabase HTTPS připojení, data/blob obrázky a současné inline skripty/styly. CSP se v tomto milníku nevynucuje.

## Testy a výsledky

### Regresní testy

```text
node scripts/build-production.js
node --test --test-concurrency=1 tests/security.test.js tests/build.test.js tests/internal-assets.test.js
```

Výsledek: **11 testů, 11 prošlo, 0 selhalo**.

Ověřeno mimo jiné:

- `<img src=x onerror=alert(1)>` zůstane textem a nevytvoří `img`,
- `javascript:alert(1)` nevytvoří odkaz,
- HTTPS odkaz má `noopener noreferrer`,
- aktivní produkční JS neobsahuje `127.0.0.1:7242`,
- chatbot neobsahuje původní HTML injection sink,
- allowlist obsahuje hlavní stránky a assety,
- sedm povinně zakázaných cest ani vývojové typy souborů nejsou v `dist`.

### JavaScript syntax

```powershell
Get-ChildItem -Recurse -File -Filter *.js |
  Where-Object { $_.FullName -notlike '*\dist\*' } |
  ForEach-Object { node --check $_.FullName }
```

Výsledek: všechny zdrojové JavaScriptové soubory prošly.

### Interní script a stylesheet cesty

`tests/internal-assets.test.js` kontroluje lokální `<script src>` a stylesheet `<link href>` v celém produkčním HTML. Nevznikla žádná nová chybějící cesta.

Test dokumentuje tři předchozí, tímto milníkem záměrně neřešené odkazy:

- `audio-prompts-db.js`,
- `prezentace-prompts-db.js`,
- `video-prompts-db.js`.

### Lokální HTTP smoke

```text
node tests/http-smoke.js
```

Výsledek: **28 veřejných cest vrátilo 200 a 7 zakázaných cest vrátilo 404**. Kontrola zahrnuje hlavní stránky, všech 15 aktivních modulů a požadované CSS/JS soubory.

### Browser smoke

Lokální `dist` byl ověřen v prohlížeči přes `http://127.0.0.1:8765/`:

- hlavní stránka se načetla bez console warning/error,
- chatbot se otevřel a přijal payload,
- výsledný text byl přesně `<img src=x onerror=alert(1)>`,
- počet vytvořených `img` uvnitř zprávy byl 0,
- nevznikl JavaScript dialog,
- `modules/infografika-prompty.html` načetla titul, čtyři stylesheets a chatbot.

## Známá omezení

- Stav RLS a databázových grantů zůstává mimo M0B1 a musí být ověřen samostatně.
- Čtyři velké Supabase prompt renderery stále používají `innerHTML`; jejich přepis je výslovně mimo tento milník.
- Tři chybějící prompt DB skripty jsou známý předchozí stav.
- `infografika-prompty.html` při browser smoke vykázala předchozí inline chybu `initializeAdminPanel()` při práci s chybějícím DOM prvkem. Soubor nebyl v M0B1 změněn a HTTP/script/stylesheet cesty se načetly.
- CSP zůstává pouze Report-Only a stále obsahuje `unsafe-inline`, dokud neproběhne samostatná migrace inline kódu.

## Databáze a RLS

V průběhu M0B1:

- nebyl odeslán žádný produkční databázový zápis,
- nebyla změněna žádná produkční data,
- nebyla změněna Supabase RLS,
- nebyla vytvořena ani spuštěna databázová migrace.
