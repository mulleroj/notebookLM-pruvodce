# -*- coding: utf-8 -*-
import os
import codecs

# Precise map based on observed corrupted strings in video-prompty.html and audio-prompty.html
FIX_MAP = {
    # Headers
    'PĹ™ehled': 'přehled', 
    'Video PĹ™ehled': 'Video přehled',
    'Audio PĹ™ehled': 'Audio přehled',
    
    # Emojis (Windows-1250/1252 artifacts)
    'đŸŽĽ': '🎥',  # F0 9F 8E A5 -> đ Ÿ Ž Ľ (CP1250)
    'đŸŽ¨': '🎨',  # F0 9F 8E A8 -> đ Ÿ Ž ¨ (CP1250)
    'đŸ“š': '📚',  # F0 9F 93 9A -> đ Ÿ “ š (CP1250)
    'đŸ’Ą': '💡',  # F0 9F 92 A1 -> đ Ÿ ’ Ą (CP1250) / 💡
    'đŸ“ˆ': '📈',  # F0 9F 93 88 -> đ Ÿ “ ˆ (CP1250/1252?)
    'đŸŽŻ': '🎯',
    'đŸŒ ': '🌍',
    'đŸ’°': '💰',
    'đŸŽ“': '🎓',
    'đŸ”Ź': '🔬',
    'đŸ †': '🏆',
    'đŸŒŸ': '🌟',
    'đŸ“ą': '📱',
    'đŸŽ­': '🎭',
    'đŸŒą': '🌱',
    
    # Specific mess for Stopwatch ⏱️
    'â ąď¸ ': '⏱️',
    'â ąď¸': '⏱️',
    
    # Specific mess for Čas => ÄŒas (CP1252 artifact for C4 8C)
    'ÄŒas': 'Čas',
    'ÄŒ': 'Č',
    
    # Other potential leftovers
    'PĹ™ipravenĂŠ': 'Připravené',
    'PĹ™i': 'Při',
    'ĹžĂĄdnĂŠ': 'žádné',
    'ÄŤ': 'č',
    'â “': '❓', 
}

def repair_file(file_path):
    if not os.path.exists(file_path):
        return

    print(f"Cleaning {file_path}...")
    try:
        # Read as UTF-8
        with codecs.open(file_path, 'r', 'utf-8-sig') as f:
            content = f.read()
            
        original = content
        
        for k, v in FIX_MAP.items():
            content = content.replace(k, v)
            
        if content != original:
            with codecs.open(file_path, 'w', 'utf-8-sig') as f:
                f.write(content)
            print(f"  ✓ Fixed items in {file_path}")
        else:
            print("  No patterns found.")
            
    except Exception as e:
        print(f"  Error: {e}")

# Target only the prompt files + a few others likely to have these icons
target_files = [
    "modules/audio-prompty.html",
    "modules/video-prompty.html",
    "modules/infografika-prompty.html",
    "modules/prezentace-prompty.html",
    "modules/zpravy-prehled.html", # Might have lists too
    "index.html", # Just in case
    "use-cases.html" # Just in case
]

for f in target_files:
    repair_file(f)
