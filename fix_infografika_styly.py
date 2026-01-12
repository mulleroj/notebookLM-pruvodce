
import os

def fix_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Hardcoded map based on file analysis and known CP1250 layout
        replacements = {
            'Ĺ™': 'ř',    # C5 99
            'Ä›': 'ě',    # C4 9B
            'ÄŤ': 'č',    # C4 8D
            'Ĺž': 'ž',    # C5 A1? No, Ĺž is consistent in these files.
            'Ĺˇ': 'š',    # C5 A1
            'Ă˝': 'ý',    # C3 BD
            'ĂĄ': 'á',    # C3 A1
            'Ă­': 'í',    # C3 AD
            'Ă©': 'é',    # C3 A9
            'ĹŻ': 'ů',    # C5 AF
            'ÄŹ': 'ď',    # C4 8F
            'ĹĄ': 'š',    # Found in 'lepĹĄí', 'ĹĄpatnÄ›' -> š
            'â˜°': '☰',   # E2 98 B0
            'ZpÄ›t': 'Zpět',
            
            # Additional context-based fixes
            'pĹ™ekáĹží': 'překáží',
            'ĹĄpatnÄ›': 'špatně',
            'uÄ itele': 'učitele',
            'provÄ›Ĺ™ených': 'prověřených',
            'Zásada Ä íslo': 'Zásada Číslo', # 'Ä ' -> 'Č'
            'Ä ení': 'čtení',
            'pĹ™ehledir': 'přehledů', # weird case?
            'pĹ™ehledĹŻ': 'přehledů', # standard match
            
            # Explicit CP1250 byte-sequence matches if read as unicode chars
            # 'Ř' -> \xc5\x98. \x98 is undefined in CP1250, so it might appear as replacement char or literally?
            # In file view: "Styly, kterĂŠ do NotebookLM infografiky NEPATĹ˜Ă" (Line 481)
            # "NEPATĹ˜Ă" -> "NEPATŘÍ".
            # "Ĺ˜" -> "Ř".
            'Ĺ˜': 'Ř',
            
            # "Č" -> "ÄŒ" (Line 200 ??? No line 200 was "Ä íslo")
        }
        
        fixed_content = content
        count = 0
        
        # Sort replacements by length descending
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
