
import os

def fix_file(filepath):
    print(f"Processing {filepath}...")
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        replacements = {
            '1ď¸âŁ': '1️⃣',
            '2ď¸âŁ': '2️⃣',
            '3ď¸âŁ': '3️⃣',
            '4ď¸âŁ': '4️⃣',
            '5ď¸âŁ': '5️⃣',
            '6ď¸âŁ': '6️⃣',
            '7ď¸âŁ': '7️⃣',
            '(1â2)': '(1–2)',
            '(KONTROLOVANĂ)': '(KONTROLOVANÁ)',
            '(ZĂKLAD)': '(ZÁKLAD)',
            'DÄjepis': 'Dějepis',
            'HodnÄ': 'Hodně',
            'KrátkĂŠ': 'Krátké',
            'MetodickĂŠ': 'Metodické',
            'PĹehledy': 'Přehledy',
            'VýbornĂŠ': 'Výborné',
            'âTaháky"': '„Taháky“',
            'ŽĂDNĂ': 'ŽÁDNÉ',
            'VraĹĽte': 'Vraťte',
            'NEPATĹĂ': 'NEPATŘÍ',
            'ProÄ': 'Proč',
            'PĹipraveni': 'Připraveni',
            'UmÄleckĂŠ': 'Umělecké',
            'UÄitele': 'Učitele',
            'UÄ itele': 'Učitele',
            'ZpÄt': 'Zpět',
            'NepĹehánÄt': 'Nepřehánět',
            'NevhodnĂŠ': 'Nevhodné',
            'â¨': '✨',
            'dlouhĂŠ': 'dlouhé',
            'dobĹe': 'dobře',
            'horizontálnÄ': 'horizontálně',
            'klíÄovou': 'klíčovou',
            'konkrĂŠtních': 'konkrétních',
            'konzistentnÄ': 'konzistentně',
            'koĹení': 'koření',
            'krátkĂŠ': 'krátké',
            'kterĂŠ': 'které',
            'logickĂŠ': 'logické',
            'menu">â°': 'menu">☰',
            'nĂŠst': 'nést',
            'okamžitÄ': 'okamžitě',
            'omáÄka': 'omáčka',
            'opakovanĂŠ': 'opakované',
            'patĹí': 'patří',
            'perfektnÄ': 'perfektně',
            'podĹízený': 'podřízený',
            'poÄet': 'počet',
            'provÄĹených': 'prověřených',
            'provÄ›Ĺ™ených': 'prověřených',
            'pĹed': 'před',
            'pĹehledový': 'přehledový',
            'pĹekáží': 'překáží',
            'pĹíklad': 'příklad',
            'realistickĂŠ': 'realistické',
            'scĂŠny': 'scény',
            'složitĂŠ': 'složité',
            'struktuĹe': 'struktuře',
            'tvoĹit': 'tvořit',
            'tĹi)': 'tři)',
            'tĹídy': 'třídy',
            'uÄitele': 'učitele',
            'vertikálnÄ': 'vertikálně',
            'vysvÄtlení': 'vysvětlení',
            'vysvÄtlování': 'vysvětlování',
            'vÄty': 'věty',
            'zátÄž': 'zátěž',
            'Äasová': 'časová',
            'Ätení': 'čtení',
            'Ätou': 'čtou',
            'Äíslo': 'Číslo',
            'Äíslování': 'číslování',
            'âPrezentaÄní': '„Prezentační',
            'âhezkej".': '„hezkej“.',
            'âjak': '„jak',
            'ânerozpadá"': '„nerozpadá“',
            'VhodnÊ': 'Vhodné', # Line 226
            'â Vhodné': '✅ Vhodné', # Assuming checkmark for "Vhodné pro" sections
            'â VhodnÊ': '✅ Vhodné',
            'â\n VhodnÊ': '✅\n Vhodné', # Line break match
            'Section iconâ¨': 'Section icon✨', # If needed
            'â†’': '→',
            'â€ž': '„', # Quote start
            'â€ś': '“', # Quote end?
            'ĹĄ': 'š',
            'Ĺ™': 'ř',
            'Ä›': 'ě',
            'ÄŤ': 'č',
            'Ĺž': 'ž',
            'Ă˝': 'ý',
            'ĂĄ': 'á',
            'Ă­': 'í',
            'Ă©': 'é',
            'ĹŻ': 'ů',
            'ÄŹ': 'ď', 
            'ĹĽ': 'ť', # In VraĹĽte -> Vraťte
            'Ăş': 'ú',
            'Ăł': 'ó',
            'Ä ': 'č', # Zásada Ä íslo -> Číslo. Ä -> Č? No 'Ä ' -> 'Č'
            'ťpatnÄ': 'špatně', # ťpatnÄ -> špatně
            'pĹ™': 'př', # Generic fix for pĹ™
        }
        
        # Emoji cleanups
        # đŸ“‹ -> 📋
        # đŸŽ¯ -> 🎯
        # đŸ’Ş -> 💪
        # âš ď¸ -> ⚠️
        # đŸŽ“ -> 🎓
        # đŸ“š -> 📚
        # đŸ” -> 🔍
        # đŸŽ¨ -> 🎨
        # âœ -> ✅ (Heavy Check Mark?)
        # âœ¨ -> ✨
        
        replacements['đŸ“‹'] = '📋'
        replacements['đŸŽ¯'] = '🎯'
        replacements['đŸ’Ş'] = '💪'
        replacements['âš ď¸'] = '⚠️'
        replacements['đŸŽ“'] = '🎓'
        replacements['đŸ“š'] = '📚'
        replacements['đŸ”'] = '🔍'
        replacements['đŸŽ¨'] = '🎨'
        replacements['âœ'] = '✅' # Or âœ” (Heavy Check Mark)
        # Line 199: <span class="section-icon">âœ¨</span> -> ✨
        # Line 200: Zásada Ä íslo -> Zásada Číslo
        
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
