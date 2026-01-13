# Supabase + Netlify Setup Guide

## ✅ Aktuální stav

Supabase je už nakonfigurované v projektu:
- **Supabase URL**: `https://ukrwqmaiddvmvkmeqzcv.supabase.co`
- **Anon Key**: Je v `supabase-config.js` (bezpečná pro frontend)
- **Bucket**: `prompt-examples`

## 🔧 Co je potřeba zkontrolovat

### 1. CORS nastavení v Supabase ✅ **AUTOMATICKÉ**

**Důležitá informace:** Supabase automaticky nastavuje základní CORS hlavičky pro REST API (PostgREST). **Není potřeba ručně nastavovat CORS v Dashboard** - Supabase to dělá automaticky.

**Co zkontrolovat místo toho:**

1. **RLS (Row Level Security) Policies** - to je nejčastější příčina problémů:
   - Jdi na [Supabase Dashboard](https://supabase.com/dashboard/project/ukrwqmaiddvmvkmeqzcv)
   - **Authentication** → **Policies**
   - Zkontroluj, že tabulka `prompts` má policy, která povoluje `SELECT` pro `anon` role
   - Pokud nemáš policy, vytvoř novou:
     ```sql
     -- Povolit čtení pro všechny (anon)
     CREATE POLICY "Allow public read access" 
     ON prompts FOR SELECT 
     USING (true);
     ```

2. **Test CORS připojení:**
   - Otevři `setup-cors.html` v prohlížeči (lokálně nebo na produkci)
   - Spusť všechny testy a zkontroluj výsledky
   - Pokud vidíš CORS chyby, problém je pravděpodobně v RLS policies, ne v CORS nastavení

**Poznámka:** Pokud Supabase odstranil CORS sekci z Dashboard (což se stalo v 2025), je to proto, že CORS je nyní automatický. Problémy s přístupem k databázi jsou obvykle způsobeny RLS policies, ne CORS.

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

### Rychlý test pomocí diagnostického nástroje

**Lokálně:**
1. Otevři `setup-cors.html` v prohlížeči
2. Klikni na všechny tlačítka testů
3. Zkontroluj výsledky a log

**Na produkci:**
1. Otevři `https://notebooklm-pruvodce.netlify.app/setup-cors.html`
2. Spusť všechny testy
3. Zkontroluj, jestli CORS a databázové připojení fungují

### Manuální test v Console

```javascript
// Otevři Console v prohlížeči (F12)
initSupabase();
const client = initSupabase();
console.log('Supabase client:', client);

// Test načtení dat
client.from('prompts').select('id').limit(1).then(({data, error}) => {
    if (error) {
        console.error('❌ Chyba:', error);
    } else {
        console.log('✅ Data načtena:', data);
    }
});
```

## 📋 Checklist

- [x] CORS nastavení ✅ **AUTOMATICKÉ** (Supabase to dělá sám)
- [ ] RLS policies zkontrolované ⚠️ **DŮLEŽITÉ - ZKONTROLUJ!**
- [x] Environment variables v Netlify ✅ **HOTOVO**
- [ ] Test lokálně - Supabase funguje (použij `setup-cors.html`)
- [ ] Test na produkci - Supabase funguje (použij `setup-cors.html`)
- [ ] Admin login funguje
- [ ] Prompty se načítají z databáze

## 🐛 Troubleshooting

### Problém: CORS chyby v Console

**Řešení:**
- Supabase automaticky nastavuje CORS, takže problém je pravděpodobně v RLS policies
- Zkontroluj RLS policies v Supabase Dashboard → Authentication → Policies
- Ověř, že tabulka `prompts` má policy povolující SELECT pro anon role
- Použij `setup-cors.html` pro diagnostiku

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
- [CORS Diagnostika](setup-cors.html) - lokální test
- [CORS Diagnostika (produkce)](https://notebooklm-pruvodce.netlify.app/setup-cors.html) - test na produkci
