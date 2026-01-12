
import os

def fix_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Previous byte map (still useful)
        replacements = {
            '\xc4\x8d': 'č', 
            '\xc5\x99': 'ř',
            '\xc4\x9b': 'ě',
            '\xc5\xaf': 'ů',
            '\xc5\xbe': 'ž',
            '\xc5\xa1': 'š',
            '\xc3\xbd': 'ý',
            '\xc3\xa1': 'á',
            '\xc3\xad': 'í',
            '\xc3\xa9': 'é',
            '\xc5\xa5': 'ť',
            '\xc5\x88': 'ň',
            '\xc4\x8f': 'ď',
            '\xc3\xba': 'ú',
            '\xc3\xb3': 'ó',
            '\xc5\x98': 'Ř',
            '\xc4\x8c': 'Č',
            '\xc5\xa0': 'Š',
            '\xc5\xbd': 'Ž',
            '\xe2\x9c\xa8': '✨',
            '\xe2\x98\xb0': '☰',
            '\xe2\x86\x92': '→',
            '\xe2\x9e\xa1': '➡',
            '\xe2\x9c\x85': '✅',
            '\xe2\x9a\xa0': '⚠️',
            '\xe2\x9d\x93': '❓',
            '\xe2\x80\x9e': '„',
            '\xe2\x80\x9c': '“',
            '\xe2\x80\x93': '–',

            # Literal Cleanups (Visual representations found in file view)
            'pĹ™': 'př',
            'Ĺ™': 'ř',
            'NEPATĹ˜Ă': 'NEPATŘÍ',
            'UměleckĂŠ': 'Umělecké',
            'UmÄ›leckĂŠ': 'Umělecké', 
            'patĹ™í': 'patří',
            'tvoĹ™it': 'tvořit',
            'PĹ™ipraveni': 'Připraveni',
            'â Œ': '❌', # Cross mark
            'špatně›': 'špatně',
            'tĹ™i': 'tři',
            
            # Catch-alls
            'Ĺ˜': 'Ř',
            'ĂŠ': 'é',
            'Ă ': 'á',
            'Ăí': 'í', # ?
            'â˜°': '☰',
            'âœ¨': '✨',
            'â†’': '→',
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
