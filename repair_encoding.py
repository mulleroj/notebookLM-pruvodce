# -*- coding: utf-8 -*-
import os
import codecs

# This map is built from observing 'view_file' output and the user's screenshot
# It targets the specific UTF-8 bytes that represent the corrupted characters
MAP = {
    'DatabĂĄze': 'Databáze',
    'promptĹŻ': 'promptů',
    'PromptĹŻ': 'promptů',
    'snadnĂŠ': 'snadné',
    'kopĂ­rovĂĄnĂ­': 'kopírování',
    'ukĂĄzkovĂŠ': 'ukázkové',
    'obrĂĄzky': 'obrázky',
    'HlavnĂ­': 'Hlavní',
    'HlavnÄ‚Â­': 'Hlavní',
    'zaĂ„Â Ä‚Â­t': 'začít',
    'zaĂ„Â\u008dĂ\u00adt': 'začít',
    'pĹ™ehled': 'přehled',
    'pÄšÂ™ehled': 'přehled',
    'Audio pĹ™ehled': 'Audio přehled',
    'Video pĹ™ehled': 'Video přehled',
    'MyĹĄlenkovĂĄ': 'Myšlenková',
    'MyÄšÄ„lenkovÄ‚Ä„': 'Myšlenková',
    'ZprĂĄvy': 'Zprávy',
    'ZprÄ‚Ä„vy': 'Zprávy',
    'VĂ˝ukovĂŠ': 'Výukové',
    'VÄ‚Ë ukovÄ‚Ĺ ': 'Výukové',
    'kartiÄŤky': 'kartičky',
    'kartiĂ„Â ky': 'kartičky',
    'â˜°': '☰',
    'Ä‘ÂŸÂ Â ': '🏠',
    'Ä‘ÂŸÂšÂ€': '🚀',
    'Ä‘ÂŸÂŽĹš': '🎬',
    'Ä‘ÂŸÂŽÂ§': '🎧',
    'Ä‘ÂŸÂŽÄ˝': '🎥',
    'Ä‘ÂŸÂ§Â ': '🗺️',
    'Ä‘ÂŸÂ“Â ': '📝',
    'Ä‘ÂŸÂƒÂ ': '🃏',
    'Ă˘Â Â“': '❓',
    'â “': '❓',
    'â–ź': '▼',
    'Ă˘Â–Ĺş': '▼',
    'ÄšĹť': 'ů',
    'ĹŻ': 'ů',
    'ĂĄ': 'á',
    'Ă­': 'í',
    'Ă˝': 'ý',
    'Ă©': 'é',
    'Ä›': 'ě',
    'Ĺ™': 'ř',
    'ÄŤ': 'č',
    'ÄĄ': 'ž',
    'Ä„': 'š',
    'Ăš': 'ú',
    'Ăł': 'ó',
    # Added some common double-manglings
    'Ä‚Â­': 'í',
    'Ä‚ÂĄ': 'á',
}

# Sort keys by length descending to catch longer patterns first
SORTED_KEYS = sorted(MAP.keys(), key=len, reverse=True)

def repair_file(file_path):
    if not os.path.exists(file_path):
        return
    
    print(f"Repairing {file_path}...")
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    for k in SORTED_KEYS:
        content = content.replace(k, MAP[k])
    
    if content != original:
        with codecs.open(file_path, 'w', encoding='utf-8-sig') as f:
            f.write(content)
        print("  ✓ Repaired.")
    else:
        print("  No changes needed.")

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
    "jak-zacit.html"
]

for f in files:
    repair_file(f)
