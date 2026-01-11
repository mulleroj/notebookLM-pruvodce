# -*- coding: utf-8 -*-
"""
Restore Emoji Icons in Module HTML Pages
Replaces corrupted ?? characters with proper emoji based on template
"""

import re
import codecs

# Mapping of corrupted text to correct emoji
# Based on sidebar-modules-template.html reference
emoji_replacements = {
    # Header/Navigation
    'aria-label="Toggle menu">?</button>': 'aria-label="Toggle menu">☰</button>',
    '<div class="logo-icon">??</div>': '<div class="logo-icon">📚</div>',
    
    # Sidebar icons
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Domů</span>': 
        '<span class="sidebar-icon">🏠</span>\n                        <span class="sidebar-text">Domů</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Jak začít</span>':
        '<span class="sidebar-icon">🚀</span>\n                        <span class="sidebar-text">Jak začít</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Studio Moduly</span>':
        '<span class="sidebar-icon">🎬</span>\n                        <span class="sidebar-text">Studio Moduly</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Audio přehled</span>':
        '<span class="sidebar-icon">🎧</span>\n                                <span class="sidebar-text">Audio přehled</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Video přehled</span>':
        '<span class="sidebar-icon">🎥</span>\n                                <span class="sidebar-text">Video přehled</span>',
    
    '<span class="sidebar-icon">???</span>\n                                <span class="sidebar-text">Myšlenková mapa</span>':
        '<span class="sidebar-icon">🧠</span>\n                                <span class="sidebar-text">Myšlenková mapa</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Zprávy</span>':
        '<span class="sidebar-icon">📝</span>\n                                <span class="sidebar-text">Zprávy</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Výukové kartičky</span>':
        '<span class="sidebar-icon">🃏</span>\n                                <span class="sidebar-text">Výukové kartičky</span>',
    
    '<span class="sidebar-icon">?</span>\n                                <span class="sidebar-text">Kvíz</span>':
        '<span class="sidebar-icon">❓</span>\n                                <span class="sidebar-text">Kvíz</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Infografika</span>':
        '<span class="sidebar-icon">🎨</span>\n                                <span class="sidebar-text">Infografika</span>',
    
    '<span class="sidebar-icon">???</span>\n                                <span class="sidebar-text">Prezentace</span>':
        '<span class="sidebar-icon">📽️</span>\n                                <span class="sidebar-text">Prezentace</span>',
    
    '<span class="sidebar-icon">??</span>\n                                <span class="sidebar-text">Tabulka dat</span>':
        '<span class="sidebar-icon">📋</span>\n                                <span class="sidebar-text">Tabulka dat</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Use Cases</span>':
        '<span class="sidebar-icon">💡</span>\n                        <span class="sidebar-text">Use Cases</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Troubleshooting</span>':
        '<span class="sidebar-icon">🔧</span>\n                        <span class="sidebar-text">Troubleshooting</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">SPU & ADHD</span>':
        '<span class="sidebar-icon">🧠</span>\n                        <span class="sidebar-text">SPU & ADHD</span>',
    
    '<span class="sidebar-icon">??</span>\n                        <span class="sidebar-text">Co je nového</span>':
        '<span class="sidebar-icon">📰</span>\n                        <span class="sidebar-text">Co je nového</span>',
    
    '<span class="sidebar-badge">??</span>':
        '<span class="sidebar-badge">🆕</span>',
    
    '<span class="sidebar-arrow">ˇ</span>':
        '<span class="sidebar-arrow">▼</span>',
    
    # Search icon
    '<span class="search-icon">??</span>':
        '<span class="search-icon">🔍</span>',
    
    # Navigation links - patterns
    '<a href="../index.html" class="nav-link nav-link-home">?? Domů</a>':
        '<a href="../index.html" class="nav-link nav-link-home">🏠 Domů</a>',
    
    '<a href="#tips" class="nav-link">?? Tipy</a>':
        '<a href="#tips" class="nav-link">💡 Tipy</a>',
    
    '<a href="#use-cases" class="nav-link">?? Use Cases</a>':
        '<a href="#use-cases" class="nav-link">💼 Use Cases</a>',
    
    '<a href="../use-cases.html#video" class="nav-link">??? Katalog</a>':
        '<a href="../use-cases.html#video" class="nav-link">📚 Katalog</a>',
    
    '<a href="video-prompty.html" class="nav-link">?? Prompty</a>':
        '<a href="video-prompty.html" class="nav-link">📝 Prompty</a>',
        
    '<a href="audio-prompty.html" class="nav-link">?? Prompty</a>':
        '<a href="audio-prompty.html" class="nav-link">📝 Prompty</a>',
    
    # Hero icons
    '<div class="module-hero-icon">??</div>':
        '<div class="module-hero-icon">🎥</div>',  # Default for video
    
    # Category icons
    '<span class="category-icon">??</span>':
        '<span class="category-icon">💡</span>',
    
    '<span class="category-icon">?</span>':
        '<span class="category-icon">⚙️</span>',
    
    # Card icons - generic patterns
    '<div class="card-icon">??</div>':
        '<div class="card-icon">📌</div>',
    
    '<h4>?? Video přehled</h4>':
        '<h4>🎥 Video přehled</h4>',
    
    '<h4>??? Prezentace</h4>':
        '<h4>📽️ Prezentace</h4>',
    
    # Section headers
    '<h2 class="section-title">?? TOP 10':
        '<h2 class="section-title">🏆 TOP 10',
    
    # Prompt boxes
    '<span class="prompt-label">?? Hotový prompt</span>':
        '<span class="prompt-label">📋 Hotový prompt</span>',
    
    '<button class="copy-button">?? Zkopírovat</button>':
        '<button class="copy-button">📋 Zkopírovat</button>',
    
    # Example boxes
    '<div class="example-title">?? Metoda':
        '<div class="example-title">💡 Metoda',
    
    '<div class="example-title">?? Pro tip</div>':
        '<div class="example-title">💎 Pro tip</div>',
    
    '<div class="example-title">?? Praktický příklad</div>':
        '<div class="example-title">✨ Praktický příklad</div>',
    
    # Use case icons
    '<h4>?? Co to je</h4>':
        '<h4>ℹ️ Co to je</h4>',
    
    '<h4>?? Ideální pro</h4>':
        '<h4>🎯 Ideální pro</h4>',
    
    # CTA boxes
    '<strong>?? Databáze Promptů':
        '<strong>📚 Databáze Promptů',
    
    '<strong>?? Chcete ještě víc?</strong>':
        '<strong>🎁 Chcete ještě víc?</strong>',
    
    '?? Prohlédněte si databázi promptů ›':
        '📖 Prohlédněte si databázi promptů ›',
    
    '?? Zobrazit všech':
        '📖 Zobrazit všech',
    
    # Footer
    '<p>NotebookLM Průvodce pro Učitele | Video přehled ??</p>':
        '<p>NotebookLM Průvodce pro Učitele | Video přehled 🎥</p>',
}

# Specific replacements for audio pages
audio_specific = {
    '<div class="module-hero-icon">??</div>': '<div class="module-hero-icon">🎧</div>',
    '<p>NotebookLM Průvodce pro Učitele | Audio přehled ??</p>': 
        '<p>NotebookLM Průvodce pro Učitele | Audio přehled 🎧</p>',
}

files = [
    ("modules/video-prehled.html", emoji_replacements),
    ("modules/audio-prehled.html", {**emoji_replacements, **audio_specific}),
    ("modules/myslenkova-mapa.html", emoji_replacements),
    ("modules/audio-prompty.html", {**emoji_replacements, **audio_specific}),
    ("modules/video-prompty.html", emoji_replacements),
    ("modules/karticky.html", emoji_replacements),
    ("modules/quiz.html", emoji_replacements),
    ("modules/infografika.html", emoji_replacements),
    ("modules/infografika-styly.html", emoji_replacements),
    ("modules/infografika-prompty.html", emoji_replacements),
    ("modules/prezentace.html", emoji_replacements),
    ("modules/prezentace-prompty.html", emoji_replacements),
    ("modules/tabulka-dat.html", emoji_replacements),
]

fixed_count = 0
error_count = 0

for file_path, replacements in files:
    try:
        print(f"\nProcessing {file_path}...")
        
        # Read file as UTF-8
        with codecs.open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacement_count = 0
        
        # Apply all replacements
        for old, new in replacements.items():
            if old in content:
                content = content.replace(old, new)
                replacement_count += 1
        
        if content != original_content:
            # Write back as UTF-8
            with codecs.open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            
            print(f"  ✓ Fixed {replacement_count} emoji patterns")
            fixed_count += 1
        else:
            print(f"  ⚠ No changes needed")
        
    except Exception as e:
        print(f"  ✗ Error: {e}")
        error_count += 1

print(f"\n✅ Emoji restoration complete!")
print(f"   Fixed: {fixed_count} files")
print(f"   Errors: {error_count} files")
