# -*- coding: utf-8 -*-

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

print(f"File size: {len(content)} characters")

# Count occurrences before
broken_chars = ['đŸ"', 'đŸ"‹', 'đŸ–źď¸', 'đŸ"š', 'đŸ"', 'â ď¸', 'âď¸', 'đž', 'đ¤', 'đĽ']
for char in broken_chars:
    count = content.count(char)
    if count > 0:
        print(f"Found '{char}': {count} times")

# Replace all broken emojis
replacements = {
    'đŸ" ': '🔍 ',
    'đŸ"': '🔍',
    'đŸ"‹': '📋',
    'đŸ–źď¸ ': '🖼️ ',
    'đŸ–źď¸': '🖼️',
    'đŸ"š': '📚',
    'đŸ"': '🔒',
    'â ď¸': '⚠️',
    'âď¸': '✏️',
    'đž': '💾',
    'đ¤': '🖼️',
    'đĽ': '📥',
    'â\n Ăspěťně': '✅ Úspěšně',
}

for broken, correct in replacements.items():
    if broken in content:
        count = content.count(broken)
        content = content.replace(broken, correct)
        print(f"Replaced '{broken}' with '{correct}' ({count} times)")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('\n✅ All broken emojis have been replaced!')
