# -*- coding: utf-8 -*-

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# All remaining broken characters
replacements = {
    # Admin Modal close button
    'Ă': '×',
    
    # Admin tabs and buttons
    'âď¸': '✏️',
    'â': '➕',
    'đž': '💾',
    'â Œ': '❌',
    
    # Icon dropdown options
    'đ¨': '🎨',
    'đ': '📊',
    'đŻ': '🎯',
    'đĄ': '💡',
    'đ': '📈',
    'đ': '🌍',
    'đ°': '💰',
    'đ': '🎓',
    'đ Ź': '🔬',
    'đ ': '🏆',
    'đ ': '⭐',
    'đ ą': '📱',
    'đ ­': '🎭',
    
    # Upload section
    'đ¤': '🖼️',
    
    # Czech characters
    'Napiťte': 'Napište',
    'volitelnĂŠ': 'volitelné',
    'Klikněte': 'Klikněte',
    'přetáhněte': 'přetáhněte',
    'Ăspěch': 'Úspěch',
}

count = 0
for broken, correct in replacements.items():
    if broken in content:
        occurrences = content.count(broken)
        content = content.replace(broken, correct)
        count += occurrences
        print(f"✓ {broken} → {correct} ({occurrences}x)")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\n✅ Fixed {count} broken characters in Admin Modal!')
