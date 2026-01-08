# NotebookLM Průvodce pro Učitele 📚

Kompletní průvodce využitím NotebookLM ve vzdělávání s 192 praktickými use cases, moduly a troubleshooting tipy.

## 🚀 Quick Start

### Zobrazit lokálně

Otevřete `index.html` v prohlížeči nebo použijte lokální server:

```bash
# Python 3
python -m http.server 8000

# PHP
php -S localhost:8000

# Node.js (install live-server global)
npx live-server
```

Poté navštivte: `http://localhost:8000`

### Deploy na Netlify

1. **Fork/Clone repository**
2. **Připojit na Netlify:**
   - Přihlásit se na [netlify.com](https://netlify.com)
   - "Add new site" → "Import an existing project"
   - Vybrat GitHub repository
   - Deploy! 🎉

Podrobné instrukce: viz [DEPLOY.md](DEPLOY.md)

## 📁 Struktura Projektu

```
Gema/
├── index.html              # Hlavní stránka
├── jak-zacit.html         # Průvodce pro začátečníky
├── use-cases.html         # 192 praktických příkladů
├── troubleshooting.html   # Řešení problémů
├── spu-adhd.html          # Podpora SPU a ADHD
├── novinky.html           # Co je nového
│
├── modules/               # Studio moduly NotebookLM
│   ├── audio-prehled.html
│   ├── video-prehled.html
│   ├── myslenkova-mapa.html
│   ├── karticky.html
│   ├── quiz.html
│   └── ...
│
├── novinky/              # Novinky a aktualizace
│   └── 2025-12-lecture-mode.html
│
├── assets/               # Statické assety
│   ├── icons/           # Emoji ikony (PNG)
│   ├── images/          # Obrázky
│   └── fonts/           # Vlastní fonty (pokud jsou)
│
├── styles.css           # Hlavní styly
├── sidebar.css          # Styly sidebaru
├── chatbot.css          # Styly chatbota
│
├── script.js            # Hlavní JavaScript
├── sidebar.js           # Sidebar funkcionalita
├── chatbot.js           # AI chatbot
├── chatbot-knowledge.js # Znalostní báze chatbota
│
├── netlify.toml         # Netlify konfigurace
├── .gitignore           # Git ignore soubory
├── .gitattributes       # Git line endings
└── DEPLOY.md            # Deployment průvodce
```

## ✨ Funkce

- ✅ **192 Use Cases** - Praktické příklady využití NotebookLM
- ✅ **9 Studio Modulů** - Detailní průvodce funkcemi
- ✅ **Interaktivní Sidebar** - Snadná navigace
- ✅ **AI Chatbot** - Kontextová pomoc přímo na webu
- ✅ **Responsive Design** - Funguje na mobilu i desktopu
- ✅ **Offline Ready** - Statický web bez závislostí
- ✅ **SEO Optimalizováno** - Meta tagy a strukturovaná data
- ✅ **Dark Mode Support** - Připraveno pro tmavý režim

## 🛠️ Technologie

- **Frontend:** Pure HTML5, CSS3, Vanilla JavaScript
- **Ikony:** Emoji PNG s transparentním pozadím
- **Fonts:** Google Fonts (Inter)
- **Hosting:** Optimalizováno pro Netlify
- **Build:** Žádné - čistý statický web

## 🎨 Customizace

### Barvy

Upravte CSS proměnné v `styles.css`:

```css
:root {
    --primary-blue: #4285f4;
    --primary-dark: #1a73e8;
    --secondary-blue: #669df6;
    ...
}
```

### Sidebar

Úprava navigace: upravte sidebar HTML v každém souboru nebo použijte `sidebar-template.html`

### Chatbot

Aktualizace znalostní báze: upravte `chatbot-knowledge.js`

## 📝 Aktualizace Obsahu

### Přidat nový Use Case

1. Otevři `use-cases.html`
2. Zkopíruj existující `.use-case-card` blok
3. Uprав číslo, název a obsah
4. Aktualizuj počet v sidebaru

### Přidat nový modul

1. Vytvoř nový HTML soubor v `modules/`
2. Použij header/footer/sidebar ze stávajících modulů
3. Přidej odkaz do sidebaru všech stránek

### Aktualizovat novinky

1. Vytvoř nový článek v `novinky/`
2. Přidej odkaz v `novinky.html`
3. Aktualizuj "Nejnovější aktualizace" box

## 🔧 Development

### Testování lokálně

```bash
# Doporučeno: Python HTTP server
cd Gema
python -m http.server 8000
```

### Kontrola konzistence

- Zkontroluj všechny odkazy fungují
- Ověř responsive design (DevTools → Device Mode)
- Otestuj sidebar na mobilu
- Zkontroluj, že všechny obrázky se načítají

### Optimalizace před deploymentem

- ✅ Minifikace CSS/JS (volitelné)
- ✅ Optimalizace obrázků (WebP formát)
- ✅ Komprese HTML (volitelné)

## 📊 Analytics & Monitoring

Netlify poskytuje základní analytics zdarma. Pro pokročilé tracking:

1. Přidej Google Analytics
2. Integrace přes Netlify Analytics (plating)
3. Vlastní tracking skript

## 🤝 Přispívání

1. Fork repository
2. Vytvoř feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit změny (`git commit -m 'Add some AmazingFeature'`)
4. Push do branch (`git push origin feature/AmazingFeature`)
5. Otevři Pull Request

## 📄 Licence

Tento projekt je k dispozici pro vzdělávací účely.

## 🙏 Poděkování

- **NotebookLM Team** @ Google
- Učitelské komunitě za inspiraci a feedback
- Font: Inter od Rasmus Andersson

## 📞 Kontakt

Máte dotazy nebo návrhy? Kontaktujte autora nebo otevřete issue na GitHubu.

---

**Poslední aktualizace:** Prosinec 2025  
**Verze:** 3.0  
**Status:** ✅ Production Ready
