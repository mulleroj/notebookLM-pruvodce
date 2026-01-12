# -*- coding: utf-8 -*-
import os
import codecs

# Comprehensive map of mangled character sequences to their correct originals
# Based on the CP1250 on UTF-8 bytes logic (C4/C5/C3 patterns)
MEGA_MAP = {
    'đŸŽ¨': '🎨', 'đŸ“Š': '📊', 'đŸŽŻ': '🎯', 'đŸ’💡': '💡', # wait 💡 is F0 9F 92 A1
    'đŸ’Ą': '💡', 'đŸ“ˆ': '📈', 'đŸŒ ': '🌍', 'â ąď¸ ': '⏱️',
    'đŸ’°': '💰', 'đŸŽ“': '🎓', 'đŸ”Ź': '🔬', 'đŸ †': '🏆',
    'đŸŒŸ': '🌟', 'đŸ“ą': '📱', 'đŸŽ­': '🎭', 'đŸŒą': '🌱',
    'đŸ“š': '📚', 'đŸ  ': '🏠', 'đŸš€': '🚀', 'đŸŽŹ': '🎬',
    'đŸŽ§': '🎧', 'đŸŽĽ': '🎥', 'đŸ§ ': '🗺️', 'đŸ“ ': '📝',
    'đŸƒ ': '🃏', 'â “': '❓', '×': '×', 'â–▼': '▼', 'â–ź': '▼',
    'PĹ™ipravenĂŠ': 'Připravené', 'pĹ™ipravenĂŠ': 'připravené',
    'pĹ™ehled': 'přehled', 'PĹ™ehled': 'přehled',
    'UÄ itele': 'Učitele', 'uÄ itele': 'učitele',
    'NaÄŤĂ­tĂĄm': 'Načítám', 'nĂĄzev': 'název',
    'smazĂĄn': 'smazán', 'obnovĂ­': 'obnoví',
    'aktualizovĂĄn': 'aktualizován', 'pĹ™idĂĄn': 'přidán',
    'pĹ™i': 'při', 'nemĂĄte': 'nemáte',
    'ĹžĂĄdnĂŠ': 'žádné', 'vlastnĂ­': 'vlastní',
    'kopírování': 'kopírování', 'kopĂ­rovĂĄnĂ­': 'kopírování',
    'snadnĂŠ': 'snadné', 'ukĂĄzkovĂŠ': 'ukázkové',
    'obrĂĄzky': 'obrázky', 'HlavnĂ­': 'Hlavní',
    'PĹ™ihlásit': 'Přihlásit', 'PĹ™ihlĂĄsit': 'Přihlásit',
    'Odhlásit': 'Odhlásit', 'UloĹžit': 'Uložit',
    'ZruĹĄit': 'Zrušit', 'VaĹĄe': 'Vaše',
    'ÄŤ': 'č', 'Ä›': 'ě', 'Ä„': 'š', 'ÄĄ': 'ž', 'ÄŹ': 'ď', 'ÄŤ': 'č',
    'ĂĄ': 'á', 'Ă­': 'í', 'Ă˝': 'ý', 'Ă©': 'é', 'Ăš': 'ú', 'Ăł': 'ó',
    'Ă ': 'í', 'Ä‚': 'ě', 'Äš': 'ř', 'Ĺ™': 'ř', 'ĹŻ': 'ů',
    'ÄŤĂ­': 'čí', 'zaÄ ít': 'začít', 'zaĂ„Â\u008dĂ\u00adt': 'začít'
}

# Sort by length descending
SORTED_KEYS = sorted(MEGA_MAP.keys(), key=len, reverse=True)

def repair_content(content):
    orig = content
    for k in SORTED_KEYS:
        content = content.replace(k, MEGA_MAP[k])
    return content

def walk_and_fix(root_dir):
    for root, dirs, files in os.walk(root_dir):
        if '.git' in dirs: dirs.remove('.git')
        for file in files:
            if file.endswith('.html') or file.endswith('.js') or file.endswith('.css'):
                path = os.path.join(root, file)
                try:
                    with codecs.open(path, 'r', 'utf-8-sig') as f:
                        content = f.read()
                    
                    new_content = repair_content(content)
                    
                    if new_content != content:
                        with codecs.open(path, 'w', 'utf-8-sig') as f:
                            f.write(new_content)
                        print(f"Fixed: {path}")
                except Exception as e:
                    print(f"Error skipping {path}: {e}")

walk_and_fix('.')
print("\nMega repair complete!")
