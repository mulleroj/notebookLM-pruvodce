
import os

def fix_encoding_dict(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        replacements = {
            'Ĺ™': 'ř',
            'Ä›': 'ě',
            'Ĺˇ': 'š',
            'ÄŤ': 'č',
            'Ĺž': 'ž',
            'Ă˝': 'ý',
            'Ăˇ': 'á',
            'Ă­': 'í',
            'Ă©': 'é',
            'ĹŻ': 'ů',
            'ÄŹ': 'ď',
            'ĹĄ': 'ť',
            'Ĺ': 'ň',
            'â˜°': '☰',
            'Ăş': 'ú',
            'Ăł': 'ó',
            'Ă„': 'Ä', # Maybe?
            'Ă–': 'Ö',
            'Ăœ': 'Ü',
            'Ăź': 'ü',
            'Ä…': 'ą',
            'Ä™': 'ę',
            'ZpÄ›t': 'Zpět', # Explicit word checks if needed
            'pĹ™': 'př',
        }
        
        # Add capital versions
        # "Ř" -> "C5 98" -> "Ĺ˜"
        replacements['Ĺ˜'] = 'Ř'
        # "Š" -> "C5 A0" -> "Ĺ "
        replacements['Ĺ '] = 'Š' # Note space? No, 0xA0 is NBSP in CP1252. In CP1250 it is NBSP. So "Ĺ "
        # "Č" -> "C4 8C" -> "ÄŒ"
        replacements['ÄŒ'] = 'Č'
        # "Ž" -> "C5 BD" -> "Ĺ˝"
        replacements['Ĺ˝'] = 'Ž'
        # "Ý" -> "C3 DD" -> "Ă "
        replacements['Ă '] = 'Ý'
        # "Á" -> "C3 81" -> "Ă "
        replacements['Ă'] = 'Á' # 0x81 is often control char in Windows sets, but let's see.
        # "Í" -> "C3 8D" -> "ĂŤ" (0x8D is usually undefined/control?)
        # "É" -> "C3 89" -> "Ă‰"
        replacements['Ă‰'] = 'É'
        # "Ú" -> "C3 9A" -> "Ăš"
        replacements['Ăš'] = 'Ú'
        # "Ů" -> "C5 AE" -> "Ĺ®"
        replacements['Ĺ®'] = 'Ů'
        # "Ď" -> "C4 8E" -> "ÄŽ"
        replacements['ÄŽ'] = 'Ď'
        # "Ť" -> "C5 A4" -> "Ĺ¤"
        replacements['Ĺ¤'] = 'Ť'
        # "Ň" -> "C5 87" -> "Ĺ‡"
        replacements['Ĺ‡'] = 'Ň'


        fixed_content = content
        count = 0
        for bad, good in replacements.items():
            if bad in fixed_content:
                c = fixed_content.count(bad)
                fixed_content = fixed_content.replace(bad, good)
                count += c
                print(f"  Replaced {c} occurrences of '{bad}' -> '{good}'")

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
        fix_encoding_dict(f)
    else:
        print(f"File not found: {f}")
