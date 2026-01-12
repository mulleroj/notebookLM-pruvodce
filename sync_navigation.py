# -*- coding: utf-8 -*-
import os
import re
import codecs

# 1. Extract clean sidebar and sticky nav from index.html
with codecs.open('index.html', 'r', 'utf-8-sig') as f:
    index_content = f.read()

# Sidebar: <aside class="sidebar"> ... </aside>
sidebar_match = re.search(r'(<aside class="sidebar">.*?</aside>)', index_content, re.DOTALL)
if not sidebar_match:
    print("Could not find sidebar in index.html")
    exit(1)
index_sidebar = sidebar_match.group(1)

# Sticky Nav: <nav class="sticky-nav"> ... </nav>
sticky_nav_match = re.search(r'(<nav class="sticky-nav">.*?</nav>)', index_content, re.DOTALL)
if not sticky_nav_match:
    print("Could not find sticky-nav in index.html")
    exit(1)
index_sticky_nav = sticky_nav_match.group(1)

def fix_paths(content, to_modules=True):
    """Adjusts paths in the navigation blocks for module pages."""
    if to_modules:
        # From root (index.html) to modules/
        # href="modules/..." -> href="..."
        content = content.replace('href="modules/', 'href="')
        # href="jak-zacit.html" -> href="../jak-zacit.html"
        content = content.replace('href="jak-zacit.html"', 'href="../jak-zacit.html"')
        content = content.replace('href="index.html"', 'href="../index.html"')
        content = content.replace('href="use-cases.html"', 'href="../use-cases.html"')
        content = content.replace('src="assets/', 'src="../assets/')
    return content

# Prepare navigation blocks for module pages
module_sidebar = fix_paths(index_sidebar, to_modules=True)
module_sticky_nav = fix_paths(index_sticky_nav, to_modules=True)

# Also prepare a fix for common mangled headers in main content
CONTENT_MAP = {
    'đŸŽ§ Databáze promptů pro Audio PĹ™ehled': '🎧 Databáze promptů pro Audio přehled',
    'đŸŽ¨ Databáze promptů pro Infografiku': '🎨 Databáze promptů pro Infografiku',
    'đŸ“˝ď¸  Databáze promptů pro Prezentace': '📽️ Databáze promptů pro Prezentace',
    'đŸŽĽ Databáze promptů pro Video PĹ™ehled': '🎥 Databáze promptů pro Video přehled',
    'PĹ™ipravenĂŠ prompty': 'Připravené prompty',
    'PĹ™ihlásit': 'Přihlásit',
    'pĹ™ihláĹĄen': 'přihlášen'
}

def sync_file(file_path):
    if not os.path.exists(file_path):
        return
    
    print(f"Syncing and repairing {file_path}...")
    with codecs.open(file_path, 'r', 'utf-8-sig') as f:
        content = f.read()
    
    original = content
    
    # Sync Sidebar
    content = re.sub(r'<aside class="sidebar">.*?</aside>', module_sidebar, content, flags=re.DOTALL)
    
    # Sync Sticky Nav
    content = re.sub(r'<nav class="sticky-nav">.*?</nav>', module_sticky_nav, content, flags=re.DOTALL)
    
    # Apply content map
    for k, v in CONTENT_MAP.items():
        content = content.replace(k, v)
    
    if content != original:
        with codecs.open(file_path, 'w', 'utf-8-sig') as f:
            f.write(content)
        print("  ✓ Synced and repaired.")
    else:
        print("  No changes needed.")

module_files = [
    "modules/audio-prehled.html",
    "modules/video-prehled.html",
    "modules/myslenkova-mapa.html",
    "modules/audio-prompty.html",
    "modules/video-prompty.html",
    "modules/karticky.html",
    "modules/quiz.html",
    "modules/infografika.html",
    "modules/infografika-styly.html",
    "modules/infografika-prompty.html",
    "modules/prezentace.html",
    "modules/prezentace-prompty.html",
    "modules/tabulka-dat.html",
    "modules/zpravy-prehled.html"
]

for f in module_files:
    sync_file(f)

print("\nSync complete!")
