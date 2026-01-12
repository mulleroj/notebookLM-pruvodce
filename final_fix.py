# -*- coding: utf-8 -*-
import os
import codecs

# This map handles the specific character sequences seen in 'view_file'
# that weren't caught by the previous generic logic.
FIX_MAP = {
    'pĹ™ehled': 'přehled',
    'PĹ™ehled': 'přehled',
    'pÄšÂ™ehled': 'přehled',
    'PÄšÂ™ehled': 'přehled',
    'PĹ™ihlásit': 'Přihlásit',
    'pĹ™ihláĹĄen': 'přihlášen',
    'ĂšspÄ›ĹĄnÄ›': 'úspěšně',
    'pĹ™ihláĹĄit': 'přihlásit',
    'Odhlásit': 'Odhlásit',
    'Ĺ˝ádnĂŠ': 'Žádné',
    'hledanĂŠ': 'hledané',
    'MoĹžnostĂ­': 'možností',
    'moĹžností': 'možností',
    'PĹ™ipravenĂŠ': 'Připravené',
    'pĹ™ipravené': 'připravené',
    'kopírování': 'kopírování',
    'NaÄŤĂ­tĂĄm': 'Načítám',
    'PĹ™idat': 'Přidat',
    'UloĹžit': 'Uložit',
    'ZruĹĄit': 'Zrušit',
    'VaĹĄe': 'Vaše',
    'uloĹží': 'uloží',
    'ZpÄ›t': 'Zpět',
    'UÄ itele': 'Učitele',
    'ÄŒas': 'Čas',
    'VzdÄ›lávání': 'Vzdělávání',
    'VÄ›da': 'Věda',
    'ĂšspÄ›ch': 'Úspěch',
    'OcenÄ›ní': 'Ocenění',
    'UmÄ›ní': 'Umění',
    'đŸ“š': '📚',
    'đŸ  ': '🏠',
    'đŸš€': '🚀',
    'đŸŽŹ': '🎬',
    'đŸŽ§': '🎧',
    'đŸŽĽ': '🎥',
    'đŸ§ ': '🗺️',
    'đŸ“ ': '📝',
    'đŸƒ ': '🃏',
    'â “': '❓',
    'â–ź': '▼',
    'ÄŤ': 'č',
    'Ä›': 'ě',
    'ĂĄ': 'á',
    'Ă­': 'í',
    'Ă˝': 'ý',
    'Ä›': 'ě',
    'ÄŤ': 'č',
    'ÄĽ': 'ť',
    'ÄŹ': 'ď',
    'Äť': 'ť',
    'Äľ': 'ť',
    'Ä…': 'ą', # not czech but common in Polish which shares some encodings
    'Ä…': 'ą',
}

# The sidebar in index.html is correct.
# I'll try to extract the sidebar from index.html and put it in a template
# but first let's just do the string replacement which is safer for now.

def repair_file(file_path):
    if not os.path.exists(file_path):
        return
        
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    
    # Apply replacements
    for k, v in FIX_MAP.items():
        content = content.replace(k, v)
        
    if content != original:
        with codecs.open(file_path, 'w', encoding='utf-8-sig') as f:
            f.write(content)
        print(f"Fixed {file_path}")
    else:
        print(f"No changes for {file_path}")

files = [
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
    "modules/zpravy-prehled.html",
    "troubleshooting.html",
    "spu-adhd.html",
    "use-cases.html",
    "jak-zacit.html",
    "index.html"
]

for f in files:
    repair_file(f)
