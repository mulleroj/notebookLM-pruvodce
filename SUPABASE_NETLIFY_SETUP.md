# Supabase + Netlify Setup Guide

## ✅ Aktuální stav

Supabase je už nakonfigurované v projektu:
- **Supabase URL**: `https://ukrwqmaiddvmvkmeqzcv.supabase.co`
- **Anon Key**: Je v `supabase-config.js` (bezpečná pro frontend)
- **Bucket**: `prompt-examples`

## 🔧 Co je potřeba zkontrolovat

### 1. CORS nastavení v Supabase

Supabase musí povolit požadavky z Netlify domény. Zkontroluj v Supabase Dashboard:

1. Jdi na [Supabase Dashboard](https://supabase.com/dashboard)
2. Vyber projekt: `ukrwqmaiddvmvkmeqzcv`
3. **Settings** → **API** → **CORS**
4. Přidej do whitelist:
   - `https://notebooklm-pruvodce.netlify.app`
   - `https://*.netlify.app` (pro preview deployments)
   - `http://localhost:3000` (pro lokální vývoj)

### 2. Row Level Security (RLS) Policies

Zkontroluj, že RLS policies umožňují:
- **Čtení** (`SELECT`) pro všechny (anon key)
- **Zápis** (`INSERT/UPDATE/DELETE`) pouze pro autentizované admin uživatele

### 3. Environment Variables v Netlify ✅ HOTOVO

**Status:** Environment variables jsou už nastavené v Netlify!

- ✅ `SUPABASE_URL` - nastaveno pro production, deploy-preview, branch-deploy
- ✅ `SUPABASE_ANON_KEY` - nastaveno jako Secret pro všechny kontexty

**Kde najdeš:**
- Netlify Dashboard → **Site settings** → **Environment variables**
- Nebo přes API: `/api/v1/accounts/{account_id}/env?site_id={site_id}`

**Poznámka:** Pro frontend JavaScript nejsou nutné (kód má credentials přímo), ale jsou užitečné pro:
- Serverless funkce (pokud je přidáš v budoucnu)
- Build-time konfigurace
- Centralizovaná správa credentials

## 🧪 Testování připojení

### Lokální test
```javascript
// Otevři Console v prohlížeči na lokální stránce
initSupabase();
const client = initSupabase();
console.log('Supabase client:', client);
```

### Produkční test
1. Otevři `https://notebooklm-pruvodce.netlify.app`
2. F12 → Console
3. Zkontroluj, jestli jsou nějaké CORS chyby
4. Zkus načíst prompty - měly by se načíst z Supabase

## 📋 Checklist

- [ ] CORS nastavení v Supabase Dashboard ⚠️ **DŮLEŽITÉ - ZKONTROLUJ!**
- [ ] RLS policies zkontrolované
- [x] Environment variables v Netlify ✅ **HOTOVO**
- [ ] Test lokálně - Supabase funguje
- [ ] Test na produkci - Supabase funguje
- [ ] Admin login funguje
- [ ] Prompty se načítají z databáze

## 🐛 Troubleshooting

### Problém: CORS chyby v Console

**Řešení:**
- Zkontroluj CORS whitelist v Supabase Dashboard
- Přidej Netlify URL do whitelist

### Problém: "Supabase library not loaded"

**Řešení:**
- Zkontroluj, že `<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>` je před `supabase-config.js`
- Zkontroluj, že CDN není blokovaný

### Problém: Prompty se nenačítají

**Řešení:**
- Zkontroluj Console pro chyby
- Ověř, že tabulka `prompts` existuje v Supabase
- Zkontroluj RLS policies

## 🔐 Bezpečnost

- ✅ **Anon Key** je bezpečná pro frontend (má RLS ochranu)
- ⚠️ **Service Role Key** NIKDY nedávej do frontend kódu
- ✅ Admin autentizace je přes Supabase Auth
- ✅ RLS policies chrání data

## 📚 Užitečné odkazy

- [Supabase Dashboard](https://supabase.com/dashboard/project/ukrwqmaiddvmvkmeqzcv)
- [Netlify Dashboard](https://app.netlify.com/sites/notebooklm-pruvodce)
- [Supabase JavaScript Client Docs](https://supabase.com/docs/reference/javascript/introduction)
