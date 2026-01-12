
import os

def fix_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Correct keys using the actual characters seen in corruption
        # ř: C5 99 -> Ĺ (C5) + \x99 (Control)
        # č: C4 8D -> Ä (C4) + \x8d (Control)
        # ě: C4 9B -> Ä (C4) + \x9b (Control)
        # ů: C5 AF -> Ĺ (C5) + \xaf (Ż in 8859-2) -> ĹŻ
        # ž: C5 BE -> Ĺ (C5) + \xbe (ž in 8859-2) -> Ĺž
        # š: C5 A1 -> Ĺ (C5) + \xa1 (Ą in 8859-2) -> ĹĄ
        # ý: C3 BD -> Ă (C3) + \xbd (˝) -> Ă˝
        # á: C3 A1 -> Ă (C3) + \xa1 (Ą) -> ĂĄ
        # í: C3 AD -> Ă (C3) + \xad (SHY) -> Ă
        # é: C3 A9 -> Ă (C3) + \xa9 (Š) -> ĂŠ
        # ť: C5 A5 -> Ĺ (C5) + \xa5 (Ľ) -> ĹĽ
        # ň: C5 88 -> Ĺ (C5) + \x88 (Control)
        # ď: C4 8F -> Ä (C4) + \x8f (Control)
        # ú: C3 BA -> Ă (C3) + \xba (ş) -> Ăş
        # ó: C3 B3 -> Ă (C3) + \xb3 (ł) -> Ăó
        
        replacements = {
            'pĹ™': 'př',
            'Ĺ\x99': 'ř',
            'Ä\x8d': 'č', 
            'Ä\x9b': 'ě',
            'ĹŻ': 'ů',
            'Ĺž': 'ž',
            'ĹĄ': 'š',
            'Ă˝': 'ý',
            'ĂĄ': 'á',
            'Ă\xad': 'í',
            'ĂŠ': 'é',
            'ĹĽ': 'ť', # C5 A5 -> Ĺ + Ľ (A5)
            'Ĺ\x88': 'ň',
            'Ä\x8f': 'ď',
            'Ăş': 'ú',
            'Ăó': 'ó',
            'Ăł': 'ó', # Just in case

            # Uppercase
            'Ĺ\x98': 'Ř', # C5 98 -> Ĺ + ~ (98 is control?)
                          # In ISO-8859-2, 98 is control.
                          # Matches `\x98`.
            'Ä\x8c': 'Č', # C4 8C -> Ä + Ś (8C in some, val in others)
                          # C4 8C -> Ä + \x8c
            'Ĺ\xbd': 'Ž',
            'Ä\x8c': 'Č', # Dup
            
            # Emojis (Bytes E2 ...)
            # â (E2) + ...
            # ✨ (E2 9C A8) -> â + \x9c + ¨ (A8)
            'â\x9c¨': '✨',
            # ☰ (E2 98 B0) -> â + \x98 + ° (B0)
            'â\x98°': '☰',
            # → (E2 86 92) -> â + \x86 + \x92
            'â\x86\x92': '→',
            # ➡ (E2 9E A1) -> â + \x9e + ¡ (A1)
            'â\x9e¡': '➡', # A1 is ¡ in Latin1.
            # ✅ (E2 9C 85) -> â + \x9c + \x85
            'â\x9c\x85': '✅',
            # ⚠️ (E2 9A A0) -> â + \x9a +   (A0 NBSP)
            'â\x9a\xa0': '⚠️',
            # ❓ (E2 9D 93) -> â + \x9d + \x93
            'â\x9d\x93': '❓',
            
            # Quotes
            # „ (E2 80 9E) -> â + \x80 + \x9e
            'â\x80\x9e': '„',
            # “ (E2 80 9C) -> â + \x80 + \x9c
            'â\x80\x9c': '“',
            # – (E2 80 93) -> â + \x80 + \x93
            'â\x80\x93': '–',

            # Literal Cleanups (Visual representations found in file view)
            'NEPATĹ˜Ă': 'NEPATŘÍ',
            'UměleckĂŠ': 'Umělecké',
            'UmÄ›leckĂŠ': 'Umělecké', 
            'patĹ™í': 'patří',
            'tvoĹ™it': 'tvořit',
            'PĹ™ipraveni': 'Připraveni',
            'â Œ': '❌', # Cross mark
            'špatně›': 'špatně',
            
            # Fallbacks
            'â˜°': '☰',
            'â†’': '→',
            'ZpÄ›t': 'Zpět',
            'Zásada Ä íslo': 'Zásada Číslo',
        }
        
        fixed_content = content
        count = 0
        
        for bad in sorted(replacements.keys(), key=len, reverse=True):
            if bad in fixed_content:
                c = fixed_content.count(bad)
                fixed_content = fixed_content.replace(bad, replacements[bad])
                count += c

        if count > 0:
            print(f"  Total replacements: {count}. Saving...")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print("  Saved.")
        else:
            print("  No corrupted sequences found.")

    except Exception as e:
        print(f"  Failed: {e}")

f = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-styly.html"
fix_file(f)
