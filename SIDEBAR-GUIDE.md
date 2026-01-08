# Sidebar Navigation - Implementační Průvodce

## 📋 Přehled změn

### ✅ Co bylo vytvořeno

1. `sidebar.css` - Styly pro sidebar
2. `sidebar.js` - JavaScript funkčnost  
3. `sidebar-template.html` - HTML šablona

### 🎯 Co budeme měnit

- ✅ Ponecháme sticky navigation (tam kde je)
- ❌ Odstraníme breadcrumbs ze všech stránek
- ✅ Přidáme sidebar na všechny stránky

---

## 🚀 Implementace krok za krokem

### Krok 1: Přidání do `<head>` na každé stránce

```html
<head>
    <!-- Existující CSS -->
    <link rel="stylesheet" href="styles.css">
    
    <!-- PŘIDAT: -->
    <link rel="stylesheet" href="sidebar.css">
</head>
```

### Krok 2: Přidání `has-sidebar` třídy do `<body>`

```html
<!-- Bylo: -->
<body>

<!-- Bude: -->
<body class="has-sidebar">
```

### Krok 3: Vložení sidebar HTML na začátek `<body>`

Obsah ze `sidebar-template.html` vložte jako první věc v body.

### Krok 4: Odstranění breadcrumbs

**Najděte a SMAŽTE:**

```html
<!-- Breadcrumb -->
<nav class="breadcrumb">
    ...
</nav>
```

### Krok 5: Přidání JavaScriptu před `</body>`

```html
    <script src="script.js"></script>
    <!-- PŘIDAT: -->
    <script src="sidebar.js"></script>
</body>
```

---

## 📂 Které soubory upravit

### ✅ Hotovo

- Připraveny soubory: sidebar.css, sidebar.js, sidebar-template.html

### ⏳ TODO

**Hlavní:**

- `index.html` → demo prototyp
- `jak-zacit.html`
- `use-cases.html`
- `troubleshooting.html`
- `spu-adhd.html`
- `novinky.html`

**Moduly:**

- `modules/audio.html`
- `modules/video-prezentace.html`
- `modules/flashcards.html`
- `modules/quiz.html`
- `modules/infografika.html`
- `modules/prezentace.html`

---

## 📱 Responsivita

- **Desktop (>1024px):** Sidebar vždy viditelný
- **Mobile (≤1024px):** Hamburger menu ☰

---

## ✅ Quick Start

**Chcete vidět demo?**
→ Řekněte mi, ať upravím `index.html` a uvidíte sidebar v akci!
