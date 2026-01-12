# -*- coding: utf-8 -*-
import os
import codecs

# Use unicode escapes to avoid any script-encoding issues
MAP = {
    # ů : \u0139\u017B -> \u016F
    u'\u0139\u017B': u'\u016F',
    # ř : \u0139\u2122 -> \u0159
    u'\u0139\u2122': u'\u0159',
    # á : \u00C3\u00A1 -> \u00E1
    u'\u00C3\u00A1': u'\u00E1',
    # í : \u00C3\u00AD -> \u00ED
    u'\u00C3\u00AD': u'\u00ED',
    # ý : \u00C3\u00BD -> \u00FD
    u'\u00C3\u00BD': u'\u00FD',
    # é : \u00C3\u00A9 -> \u00E9
    u'\u00C3\u00A9': u'\u00E9',
    # ě : \u00C3\u011B -> \u011B (Wait, ě is C4 9B. C3 9B is nothing in CP1250)
    # Let's try common ě mangling: \u00C4\u011B -> \u011B
    u'\u00C4\u011B': u'\u011B',
    # č : \u00C4\u010D -> \u010D
    u'\u00C4\u010D': u'\u010D',
    # ž : \u00C4\u0105 -> \u017E
    u'\u00C4\u0105': u'\u017E',
    # š : \u00C4\u201E -> \u0161
    u'\u00C4\u201E': u'\u0161',
    # ú : \u00C3\u0161 -> \u00FA
    u'\u00C3\u0161': u'\u00FA',
    # ö : \u00C3\u00B6 -> \u00F6
    u'\u00C3\u00B6': u'\u00F6',
    
    # Emojis (based on \u0111\u0178... patterns)
    # 🏠 : \u0111\u0178\u00A0\u00A0 -> 🏠
    u'\u0111\u0178\u00A0\u00A0': u'\U0001F3E0',
    # 🚀 : \u0111\u0178\u0161\u20AC -> 🚀
    u'\u0111\u0178\u0161\u20AC': u'\U0001F680',
    # 🎧 : \u0111\u0178\u017D\u00A7 -> 🎧
    u'\u0111\u0178\u017D\u00A7': u'\U0001F3A7',
    # 📖 : \u0111\u0178\u201C\u0161 -> 📖
    u'\u0111\u0178\u201C\u0161': u'\U0001F4D6',
    
    # Simple direct patterns from 'view_file'
    'pĹ™ehled': 'přehled',
    'PĹ™ehled': 'přehled',
    'PĹ™ihlásit': 'Přihlásit',
    'zaÄ ít': 'začít',
    'Hlavní': 'Hlavní',
    'Ã—': '×',
    'â—ź': '▼',
    'â “': '❓',
}

def repair_file(file_path):
    if not os.path.exists(file_path): return
    print(f"Repairing {file_path}")
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    for k, v in MAP.items():
        content = content.replace(k, v)
    if content != orig:
        with codecs.open(file_path, 'w', encoding='utf-8-sig') as f:
            f.write(content)
        print("  ✓ Done")

files = [
    "modules/audio-prehled.html", "modules/video-prehled.html", "modules/myslenkova-mapa.html",
    "modules/audio-prompty.html", "modules/video-prompty.html", "modules/karticky.html",
    "modules/quiz.html", "modules/infografika.html", "modules/infografika-styly.html",
    "modules/infografika-prompty.html", "modules/prezentace.html", "modules/prezentace-prompty.html",
    "modules/tabulka-dat.html", "modules/zpravy-prehled.html",
    "troubleshooting.html", "spu-adhd.html", "use-cases.html", "jak-zacit.html", "index.html"
]

for f in files: repair_file(f)
