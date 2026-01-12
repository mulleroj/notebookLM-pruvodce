
import os

def fix_encoding_iso8859_2(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        replacements = {
            'Ĺ\x99': 'ř',    # C5 99
            'Ä\x9b': 'ě',    # C4 9B
            'ĹĄ': 'š',       # C5 A1 -> A1 is Ą in ISO-8859-2? Wait.
                             # Python docs say A1 in latin2 is Ą (U+0104).
                             # So 'ĹĄ' matches logic.
            'Ä\x8d': 'č',    # C4 8D -> 8D is control
            'Ĺľ': 'ž',       # C5 BE -> BE is ľ (U+013E) in latin2.
            'Ă˝': 'ý',       # C3 BD -> BD is ˝ (U+02DD) in latin2 (Double Acute)
                             # Wait, BD in latin2 is NOT double acute?
                             # In ISO-8859-2: BD is ˝ (U+02DD). Yes.
            'ĂĄ': 'á',       # C3 A1 -> A1 is Ą. So 'ĂĄ'.
            'Ă\xad': 'í',    # C3 AD -> AD is SHY (U+00AD). So 'Ă\xad'.
            'Ă©': 'é',       # C3 A9 -> A9 is Š (U+0160). 
            'ĹŻ': 'ů',       # C5 AF -> AF is Ż (U+017B).
            'Ä\x8f': 'ď',    # C4 8F -> 8F is control
            'ĹĽ': 'ť',       # C5 A5 -> A5 is Ľ (U+013D). So 'ĹĽ'.
            'Ĺ\x88': 'ň',    # C5 88 -> 88 is control
            'â\x98°': '☰',   # E2 98 B0 -> 98 is control
            'Ăş': 'ú',       # C3 BA -> BA is ş (U+015F)
            'Ăł': 'ó',       # C3 B3 -> B3 is ł (U+0142)
            
            # Additional safety:
            'ZpÄ\x9bt': 'Zpět',
            'pĹ\x99': 'př',
        }
        
        # Uppercase candidates
        # Ř: C5 98 -> Ĺ + \x98
        replacements['Ĺ\x98'] = 'Ř'
        # Č: C4 8C -> Ä + \x8c
        replacements['Ä\x8c'] = 'Č'
        # Š: C5 A0 -> Ĺ + NBSP (A0)
        replacements['Ĺ\xa0'] = 'Š'
        # Ž: C5 BD -> Ĺ + ˝ (BD)
        replacements['Ĺ\xbd'] = 'Ž'
        
        fixed_content = content
        count = 0
        for bad, good in replacements.items():
            if bad in fixed_content:
                c = fixed_content.count(bad)
                fixed_content = fixed_content.replace(bad, good)
                count += c
                # print(f"  Replaced {c} occurrences of '{bad.encode('unicode_escape')}' -> '{good}'")

        if count > 0:
            print(f"  Total replacements: {count}. Saving...")
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed_content)
            print("  Saved.")
        else:
            print("  No corrupted sequences found.")

    except Exception as e:
        print(f"  Failed: {e}")


files = [
    r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html",
    r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html",
    r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\audio-prompty.html"
]

for f in files:
    if os.path.exists(f):
        fix_encoding_iso8859_2(f)
    else:
        print(f"File not found: {f}")
