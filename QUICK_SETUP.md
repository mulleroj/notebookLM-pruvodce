# 🚀 Rychlý Setup - Supabase + Netlify

## ✅ Co už je hotovo

1. **Environment Variables v Netlify** ✅
   - `SUPABASE_URL` - nastaveno
   - `SUPABASE_ANON_KEY` - nastaveno jako Secret

2. **Kód je připraven** ✅
   - Supabase konfigurace v `supabase-config.js`
   - Všechny stránky načítají Supabase správně

## ⚠️ Co MUSÍŠ udělat TEĎ

### Krok 1: Nastavit CORS v Supabase (5 minut)

**Bez tohoto Supabase nebude fungovat na produkci!**

1. Otevři: https://supabase.com/dashboard/project/ukrwqmaiddvmvkmeqzcv/settings/api
2. Najdi sekci **"CORS"** nebo **"Allowed Origins"**
3. Přidej tyto URL (každý na nový řádek):
   ```
   https://notebooklm-pruvodce.netlify.app
   https://*.netlify.app
   http://localhost:8000
   ```
4. Ulož změny

**Alternativní cesta:**
- Settings → API → najdi "CORS" nebo "Site URL"
- Nebo Settings → Auth → URL Configuration

### Krok 2: Otestuj připojení

**Lokálně:**
1. Otevři `test-supabase-connection.html` v prohlížeči
2. Zkontroluj, že všechny testy projdou ✅

**Na produkci:**
1. Otevři `https://notebooklm-pruvodce.netlify.app/test-supabase-connection.html`
2. Zkontroluj výsledky testů
3. Pokud jsou CORS chyby → vrať se ke Kroku 1

### Krok 3: Ověř funkčnost

1. Otevři `https://notebooklm-pruvodce.netlify.app/modules/infografika-prompty.html`
2. F12 → Console
3. Měly by se načíst prompty z Supabase (ne z lokálního fallback)
4. Zkus admin login - měl by fungovat

## 📊 Status

- [x] Netlify site vytvořen
- [x] Environment variables nastavené
- [x] Kód připraven
- [ ] **CORS nastaven v Supabase** ← **TOHLE MUSÍŠ UDĚLAT**
- [ ] Test na produkci prošel

## 🆘 Pokud to nefunguje

### CORS chyby v Console:
```
Access to fetch at 'https://ukrwqmaiddvmvkmeqzcv.supabase.co/...' 
from origin 'https://notebooklm-pruvodce.netlify.app' has been blocked by CORS policy
```

**Řešení:** Zkontroluj CORS whitelist v Supabase Dashboard (Krok 1 výše)

### "Supabase library not loaded":
**Řešení:** Zkontroluj, že CDN není blokovaný (adblocker, firewall)

### Prompty se nenačítají:
**Řešení:** 
- Zkontroluj Console pro chyby
- Ověř, že tabulka `prompts` existuje v Supabase
- Zkontroluj RLS policies

## 📞 Rychlé odkazy

- [Supabase Dashboard](https://supabase.com/dashboard/project/ukrwqmaiddvmvkmeqzcv)
- [Netlify Dashboard](https://app.netlify.com/sites/notebooklm-pruvodce)
- [Test připojení (lokálně)](test-supabase-connection.html)
- [Test připojení (produkce)](https://notebooklm-pruvodce.netlify.app/test-supabase-connection.html)
