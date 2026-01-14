# -*- coding: utf-8 -*-

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Complete list of ALL broken sequences in admin modal
replacements = {
    # Line 950 - Tab button
    '➕ Spravovat prompty': '✏️ Spravovat prompty',
    
    # Line 957 - Add button  
    '➕ Přidat nový prompt': '➕ Přidat nový prompt',
    
    # Lines 982-996 - Icon dropdown
    '🎓¨': '🎨',
    '🎓Ż': '🎯',
    '🎓Ą': '💡',
    '🎓°': '💰',
    '🎓 Ź': '🔬',
    '🎓 ': '🏆',
    '🎓 ą': '📱',
    '🎓 ­': '🎭',
    
    # Line 1008 - Optional label
    'voliteln×Š': 'volitelné',
    
    # Line 1010 - Upload icon
    '🎓¤': '🖼️',
    
    # Line 1019 - Save button
    '🎓ž': '💾',
    
    # Line 1020-1021 - Cancel button
    '➕\r\n                            Zrušit': '❌ Zrušit',
    
    # Additional broken sequences
    '×spěch': 'Úspěch',
}

count = 0
for broken, correct in replacements.items():
    if broken in content:
        occurrences = content.count(broken)
        content = content.replace(broken, correct)
        count += occurrences
        print(f"✓ Fixed: {repr(broken)[:30]}... → {repr(correct)[:30]}... ({occurrences}x)")

# Write back
with open(file_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print(f'\n✅ Total: {count} fixes applied to Admin Modal!')
