# -*- coding: utf-8 -*-
import codecs

# Read the file with Windows-1250 encoding and convert to UTF-8
file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

# Try reading with different encodings
try:
    with open(file_path, 'r', encoding='windows-1250') as f:
        content = f.read()
    
    # Write back as UTF-8
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print('✅ File re-encoded from Windows-1250 to UTF-8 successfully!')
    
except Exception as e:
    print(f'Error with Windows-1250: {e}')
    print('Trying UTF-8...')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Manual replacements for corrupted characters
        replacements = {
            'Ÿ"š': '📚',
            'Ÿ"': '🔍',
            'Ÿ"‹': '📋',
            'Ÿ–¼ï¸': '🖼️',
            'Ÿ"': '🔒',
            'Ÿ¤': '🖼️',
            'Ÿž': '💾',
            'Ÿ¥': '📥',
            'â ï¸': '⚠️',
            'Přihláťení': 'Přihlášení',
            'Váť': 'Váš',
            'Vaťe': 'Vaše',
            'načte': 'načte',
            'uloží': 'uloží',
            'vaťe': 'vaše',
        }
        
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print('✅ Manual character fixes applied successfully!')
        
    except Exception as e2:
        print(f'Error: {e2}')
