# -*- coding: utf-8 -*-
import os
import re
import codecs

# Regex replacements for stubborn patterns
REPLACEMENTS = [
    # Header cleaning
    (r'Video P\u0139\u2122ehled', 'Video přehled'),
    (r'Audio P\u0139\u2122ehled', 'Audio přehled'),
    (r'P\u0139\u2122ehled', 'přehled'), # Generic fallback

    # Emojis (Windows-1250 artifacts)
    (r'\u0111\u0178\u017d\u013d', '🎥'), # đŸŽĽ
    (r'\u0111\u0178\u017d\u00a8', '🎨'), # đŸŽ¨
    (r'\u0111\u0178\u201c\u0161', '📚'), # đŸ“š (\u201c=“, \u0161=š)
    (r'\u0111\u0178\u2019\u0104', '💡'), # đŸ’Ą (\u2019=’, \u0104=Ą)
    (r'\u0111\u0178\u017e\u017c', '🎯'), # đŸŽŻ (\u017c=ż? 0xŻ is BF? 0xAF is Ż in 1250. 0xAF is Ż. Input was F0 9F 8E AF. AF->Ż)
    # Correcting target: F0 9F 8E AF -> đ Ÿ Ž Ż (Ż is 017B, ż is 017C). 1250 AF is Ż (017B).
    (r'\u0111\u0178\u017d\u017b', '🎯'), # đŸŽŻ match
    
    # Stopwatch (mixed/messy)
    # Matches â followed by ANY char followed by ą or similar
    # â ąď¸  -> \u00e2 . \u0105 \u010f \u00b8
    (r'\u00e2.\u0105\u010f\u00b8', '⏱️'), 
    (r'\u00e2\s\u0105\u010f\u00b8', '⏱️'), # Explicit space

    # Čas legacy CP1252? C4 8C -> Ä Œ
    (r'\u00c4\u0152as', 'Čas'), # ÄŒas
    
    # Other potential leftovers
    (r'P\u0139\u2122ipraven\u00c3\u00a9', 'Připravené'), # PĹ™ipravenĂŠ
    (r'P\u0139\u2122ihl\u00c3\u00a1sit', 'Přihlásit'), # PĹ™ihlásit
    (r'\u00c3\u2014', '×'), # Ã—
]

def clean_file(path):
    if not os.path.exists(path): return
    print(f"Scanning {path}...")
    with codecs.open(path, 'r', 'utf-8-sig') as f:
        content = f.read()
    
    orig = content
    for pattern, repl in REPLACEMENTS:
        content = re.sub(pattern, repl, content, flags=re.IGNORECASE)
        
    if content != orig:
        with codecs.open(path, 'w', 'utf-8-sig') as f:
            f.write(content)
        print(f"  ✓ Cleaned patterns in {path}")

# Run on all HTML in modules/
for f in os.listdir('modules'):
    if f.endswith('.html'):
        clean_file(os.path.join('modules', f))

# Also index and use-cases
clean_file('index.html')
clean_file('use-cases.html')
clean_file('spu-adhd.html')
