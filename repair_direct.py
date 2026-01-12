# -*- coding: utf-8 -*-
import os
import codecs

# Direct string replacements for the specific remaining mangled strings
MAP = {
    'pĹ™ehled': 'přehled',
    'PĹ™ehled': 'přehled',
    'pÄšÂ™ehled': 'přehled',
    'PÄšÂ™ehled': 'přehled',
    'PĹ™ipravenĂŠ': 'Připravené',
    'pĹ™ipravenĂŠ': 'připravené',
    'PĹ™ihlásit': 'Přihlásit',
    'pĹ™ihláĹĄen': 'přihlášen',
    'ĂšspÄ›ĹĄnÄ›': 'úspěšně',
    'PĹ™idat': 'Přidat',
    'UloĹžit': 'Uložit',
    'ZruĹĄit': 'Zrušit',
    'VaĹĄe': 'Vaše',
    'Ă—': '×',
    'â–ź': '▼',
    'đŸŽ§': '🎧',
    'đŸ  ': '🏠',
    'đŸš€': '🚀',
    'đŸŽŹ': '🎬',
    'đŸŽĽ': '🎥',
    'đŸ§ ': '🗺️',
    'đŸ“ ': '📝',
    'đŸƒ ': '🃏',
    'đŸ“š': '📚',
    'â “': '❓',
    'PĹ™ihlásit': 'Přihlásit',
    'zaÄ ít': 'začít'
}

def repair(file_path):
    if not os.path.exists(file_path): return
    with codecs.open(file_path, 'r', 'utf-8') as f:
        content = f.read()
    orig = content
    for k, v in MAP.items():
        content = content.replace(k, v)
    if content != orig:
        with codecs.open(file_path, 'w', 'utf-8-sig') as f:
            f.write(content)
        print(f"Fixed {file_path}")

files = [
    "modules/audio-prehled.html", "modules/video-prehled.html", "modules/myslenkova-mapa.html",
    "modules/audio-prompty.html", "modules/video-prompty.html", "modules/karticky.html",
    "modules/quiz.html", "modules/infografika.html", "modules/infografika-styly.html",
    "modules/infografika-prompty.html", "modules/prezentace.html", "modules/prezentace-prompty.html",
    "modules/tabulka-dat.html", "modules/zpravy-prehled.html",
    "troubleshooting.html", "spu-adhd.html", "use-cases.html", "jak-zacit.html", "index.html"
]

for f in files: repair(f)
