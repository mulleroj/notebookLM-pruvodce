# 🚀 Nasazení na Netlify

Tento dokument popisuje, jak nasadit NotebookLM Průvodce na Netlify.

## Předpoklady

- GitHub účet
- Netlify účet (zdarma na [netlify.com](https://www.netlify.com))
- Git nainstalovaný lokálně

## Krok 1: Připravit Git Repository

### Inicializovat Git (pokud ještě není)

```bash
cd "C:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema"
git init
```

### Vytvořit první commit

```bash
git add .
git commit -m "Initial commit - NotebookLM Průvodce"
```

### Propojit s GitHub

Tvůj repository je už vytvořený na: `https://github.com/mulleroj/notebookLM-pruvodce.git`

```bash
# Propoj lokální repository s GitHub
git remote add origin https://github.com/mulleroj/notebookLM-pruvodce.git

# Nastav hlavní větev
git branch -M main

# Push do GitHub
git push -u origin main
```

**Poznámka:** Pokud máš v repository už nějaké soubory (README apod.), můžeš potřebovat:

```bash
# Stáhnout aktuální stav z GitHub
git pull origin main --allow-unrelated-histories

# Poté push
git push -u origin main
```

## Krok 2: Připojit k Netlify

### Možnost A: Deploy přes Netlify Dashboard (doporučeno)

1. Přihlas se na [app.netlify.com](https://app.netlify.com)
2. Klikni na **"Add new site"** → **"Import an existing project"**
3. Vyber **"GitHub"** a autorizuj Netlify
4. Vyber svůj repository **`notebookLM-pruvodce`**
5. **Build settings:**
   - Build command: (nechat prázdné - není potřeba)
   - Publish directory: `.` (tečka = root složka)
   - Deploy branch: `main`
6. Klikni **"Deploy site"**

✨ První deploy zabere 1-2 minuty. Netlify ti dá URL typu: `https://notebooklm-pruvodce.netlify.app`

### Možnost B: Deploy přes Netlify CLI

```bash
# Nainstaluj Netlify CLI globálně
npm install -g netlify-cli

# Přihlas se
netlify login

# Inicializuj projekt
netlify init

# Deploy
netlify deploy --prod
```

## Krok 3: Nastavení Domény (volitelné)

1. V Netlify Dashboard → **"Domain settings"**
2. Přidej vlastní doménu nebo použij Netlify subdoménu
3. Pro vlastní doménu nastav DNS záznamy podle instrukcí

## Automatické Deployment

Po propojení s GitHub se web automaticky nasadí při každém push do `main` větve:

```bash
# Udělej změny v souborech
git add .
git commit -m "Popis změn"
git push origin main
# → Netlify automaticky nasadí novou verzi
```

## Konfigurace

Web už má připravený `netlify.toml` soubor s:

- ✅ Security headers (XSS protection, frame options, atd.)
- ✅ Cache strategie pro statické assety
- ✅ HTTPS redirect
- ✅ Custom 404 page handling

## Debugging

### Zkontrolovat Build Log

1. Netlify Dashboard → "Deploys"
2. Klikni na konkrétní deploy
3. Zkontroluj "Deploy log"

### Lokální Netlify Dev Server

```bash
# Spusť lokální Netlify prostředí
netlify dev
```

## Preview Branches

Netlify automaticky vytvoří preview URL pro každý pull request:

- Main branch: `https://notebooklm-pruvodce.netlify.app`
- PR preview: `https://deploy-preview-123--notebooklm-pruvodce.netlify.app`

## Performance Tips

- ✅ Všechny CSS/JS soubory jsou cache na 1 rok (immutable)
- ✅ HTML má cache 1 hodinu
- ✅ Obrázky v `/assets/` mají dlouhodobou cache
- ⚡ Zvažte optimalizaci obrázků (WebP formát)
- ⚡ Zvažte minifikaci CSS/JS pro produkci

## Troubleshooting

### Problém: Stránka se nenačítá správně

- Zkontroluj console v DevTools (F12)
- Ověř, že všechny cesty k souborům jsou relativní

### Problém: CSS/JS se nenačítá

- Ověř, že `?v=3` verze parametry jsou správné
- Zkontroluj, že soubory existují v repository

### Problém: 404 chyby pro podstránky

- Ujisti se, že `netlify.toml` má správnou 404 redirect konfiguraci

## Monitoring

Netlify poskytuje zdarma:

- 📊 Analytics (Basic)
- 🔍 Deploy logs
- ⚡ Performance monitoring
- 📧 Email notifikace pro failed builds

## Poznámky

- První deploy trvá 1-2 minuty
- Další deploymenty jsou rychlejší (30-60 sekund)
- Netlify poskytuje SSL certifikát automaticky
- Build limity (free tier): 300 minut/měsíc, 100 GB bandwidth
