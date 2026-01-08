# NotebookLM Průvodce pro Učitele - Deployment Guide

## 📋 Struktura projektu

```
Gema/
├── index.html              # Hlavní stránka
├── jak-zacit.html          # Průvodce "Jak začít"
├── use-cases.html          # Katalog 189 use cases
├── troubleshooting.html    # FAQ a řešení problémů
├── novinky.html            # Přehled novinek
├── spu-adhd.html           # Průvodce SPU & ADHD
├── formular.html           # Kontaktní formulář
│
├── novinky/
│   └── 2025-12-lecture-mode.html  # Detailní stránka novinky
│
├── modules/
│   ├── audio.html          # Audio modul
│   ├── video-prezentace.html
│   ├── flashcards.html
│   ├── quiz.html
│   ├── infografika.html
│   ├── prezentace.html
│   ├── ai-moduly.html
│   ├── studium-nastroje.html
│   └── pokrocile.html
│
├── styles.css              # Hlavní CSS
├── style.css               # Doplňkový CSS
├── script.js               # Hlavní JavaScript
├── app.js                  # Aplikační logika
└── prompts.js              # Databáze promptů
```

---

## 🚀 Možnosti deploymentu

### **Možnost 1: Netlify (DOPORUČENO - nejjednodušší)**

#### Přes Netlify UI (Drag & Drop)

1. Jdi na [netlify.com](https://www.netlify.com)
2. Přihlas se (GitHub/GitLab/Email)
3. Klikni "Add new site" → "Deploy manually"
4. **Přetáhni celou složku `Gema/` do browseru**
5. Hotovo! Netlify ti dá URL typu `https://random-name-12345.netlify.app`

#### Vlastní doména (volitelné)

1. V Netlify dashboard → "Domain settings"
2. Klikni "Add custom domain"
3. Zadej svou doménu (např. `notebooklm-pruvodce.cz`)
4. Nastav DNS u svého registrátora podle instrukcí

**Výhody:**

- ✅ Automatický HTTPS
- ✅ CDN zdarma
- ✅ Instant deploy
- ✅ Zdarma pro statické weby

---

### **Možnost 2: Vercel**

1. Jdi na [vercel.com](https://vercel.com)
2. Přihlas se přes GitHub
3. "Add New" → "Project"
4. Importuj složku nebo nastav Git repo
5. Deploy

**Výhody:**

- ✅ Bleskově rychlý
- ✅ Výborná dokumentace
- ✅ Automatické preview deployments

---

### **Možnost 3: GitHub Pages (pro technicky zdatné)**

#### Příprava

```bash
# 1. Vytvoř GitHub repository
# 2. Nahraj všechny soubory do main branch

# 3. V repository Settings → Pages:
#    - Source: Deploy from a branch
#    - Branch: main / root
#    - Save
```

**URL bude:** `https://tvuj-github-username.github.io/nazev-repo/`

**Upozornění:** Pokud web není v kořenu, uprav cesty:

```html
<!-- Bylo: -->
<link rel="stylesheet" href="styles.css">

<!-- Bude: -->
<link rel="stylesheet" href="/nazev-repo/styles.css">
```

---

### **Možnost 4: Klasický hosting (Wedos, Forpsi, WebSupport)**

#### Postup

1. **Stáhni nebo zipni celou složku `Gema/`**
2. **Připoj se přes FTP** (FileZilla, WinSCP)
   - Host: `ftp.tvojadomena.cz`
   - Username: od poskytovatele
   - Password: od poskytovatele
3. **Nahraj všechny soubory do `/public_html/` nebo `/www/`**
4. **Zkontroluj:** `https://tvojadomena.cz/index.html`

---

## ⚙️ Pre-deployment checklist

### ✅ Před nahráním zkontroluj

1. **Všechny cesty jsou relativní** (ne absolutní)

   ```html
   <!-- ✅ Správně: -->
   <link rel="stylesheet" href="styles.css">
   <a href="modules/audio.html">

   <!-- ❌ Špatně: -->
   <link rel="stylesheet" href="C:/Users/mulle/...">
   ```

2. **Všechny soubory jsou přítomné:**
   - `index.html` (vstupní bod)
   - Všechny HTML stránky
   - CSS soubory (`styles.css`, `style.css`)
   - JS soubory (`script.js`, `app.js`, `prompts.js`)
   - Složky `modules/` a `novinky/`

3. **Otestuj lokálně:**
   - Otevři `index.html` v browseru
   - Proklikej všechny odkazy
   - Zkontroluj, že se načítá CSS a JS

---

## 🔧 Rychlý test před deploymentem

**Windows PowerShell:**

```powershell
# Spusť lokální server (Python):
cd "C:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema"
python -m http.server 8000

# Otevři v browseru: http://localhost:8000
```

**Nebo použij Live Server extension ve VS Code:**

1. Nainstaluj "Live Server" extension
2. Pravý klik na `index.html` → "Open with Live Server"

---

## 📊 Optimalizace (volitelné)

### Zmenšení velikosti souborů

1. **Minifikace CSS/JS:**

   ```bash
   # Použij online nástroje:
   # - https://www.minifier.org/ (CSS)
   # - https://javascript-minifier.com/ (JS)
   ```

2. **Komprese obrázků:**
   - Pokud máte obrázky, zkomprimujte je přes [TinyPNG](https://tinypng.com/)

3. **Smazat nepotřebné soubory:**
   - `cleanup_css.py`
   - `cleanup_main_files.py`
   - `NOTEBOOKLM_PRUVODCE.md` (pokud není součástí webu)

---

## 🆘 Troubleshooting

### Problém: Stránka se načte, ale chybí styly

**Řešení:** Zkontroluj cestu k CSS v `<head>`:

```html
<link rel="stylesheet" href="styles.css">
```

### Problém: Odkazy nefungují (404)

**Řešení:** Zkontroluj, že:

- Soubory mají správná jména (case-sensitive na Linuxu!)
- Cesty jsou relativní
- Složka `modules/` a `novinky/` jsou nahrané

### Problém: JavaScript nefunguje

**Řešení:** Otevři Developer Tools (F12) → Console a zkontroluj chyby

---

## 📞 Doporučený postup (step-by-step)

### Pro začátečníky

1. **Zipni celou složku `Gema/`**
   - Pravý klik → "Odeslat do" → "Komprimovaná složka (ZIP)"

2. **Jdi na Netlify.com**
   - Zaregistruj se (email stačí)
   - "Sites" → "Add new site" → "Deploy manually"

3. **Přetáhni ZIP soubor**
   - Netlify automaticky rozbalí a nasadí

4. **Zkopíruj URL**
   - Např. `https://notebooklm-guide-xyz.netlify.app`

5. **Hotovo!** 🎉

---

## 📝 Notes

- **Backup:** Vždy si udržuj lokální kopii před deploymentem
- **Updates:** Když upravíš obsah, znovu nahraj na hosting
- **Analytics:** Můžeš přidat Google Analytics pro sledování návštěvnosti
- **SEO:** V `<head>` už máš meta tagy, takže je web SEO-ready

---

## ✅ Aktuální stav projektu (prosinec 2025)

- ✅ Všechny HTML stránky vytvořeny
- ✅ CSS styly připraveny
- ✅ JavaScript funkční
- ✅ Responsivní design
- ✅ Žádné absolutní cesty
- ✅ Připraveno k deploymentu

**Celková velikost:** ~400 KB (velmi rychlé načítání)

---

Pro jakékoliv dotazy nebo problémy s deploymentem, kontaktujte webmastera nebo otevřete issue v repository.
