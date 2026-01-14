# -*- coding: utf-8 -*-
import re

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Fix specific lines
fixes = [
    (950, '                <button class="admin-tab active" onclick="switchAdminTab(\'prompts\')">✏️ Spravovat prompty</button>\r\n'),
    (982, '                            <option value="🎨">🎨 Umění & Design</option>\r\n'),
    (983, '                            <option value="📊">📊 Data & Statistiky</option>\r\n'),
    (984, '                            <option value="🎯">🎯 Cíle & Strategie</option>\r\n'),
    (985, '                            <option value="💡">💡 Nápady & Inspirace</option>\r\n'),
    (986, '                            <option value="📈">📈 Růst & Progress</option>\r\n'),
    (987, '                            <option value="🌍">🌍 Geografie & Mapy</option>\r\n'),
    (989, '                            <option value="💰">💰 Finance & Business</option>\r\n'),
    (991, '                            <option value="🔬">🔬 Věda & Výzkum</option>\r\n'),
    (992, '                            <option value="🏆">🏆 Úspěch & Ocenění</option>\r\n'),
    (993, '                            <option value="⭐">⭐ Kvalita & Excelence</option>\r\n'),
    (994, '                            <option value="📱">📱 Technologie</option>\r\n'),
    (995, '                            <option value="🎭">🎭 Kultura & Umění</option>\r\n'),
    (996, '                            <option value="🌱">🌱 Růst & Rozvoj</option>\r\n'),
    (1010, '                            <p>🖼️ Klikněte nebo přetáhněte obrázek</p>\r\n'),
    (1019, '                        <button class="btn-copy form-btn-flex" onclick="savePrompt()">💾 Uložit</button>\r\n'),
]

# Apply fixes (line numbers are 1-indexed, list is 0-indexed)
for line_num, new_content in fixes:
    lines[line_num - 1] = new_content
    print(f"✓ Fixed line {line_num}")

# Fix line 1020-1021 (cancel button spans two lines)
lines[1019] = '                        <button class="btn-toggle-examples form-btn-flex" onclick="cancelPromptForm()">❌ Zrušit</button>\r\n'
del lines[1020]  # Remove the second line
print(f"✓ Fixed lines 1020-1021 (cancel button)")

# Write back
with open(file_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print(f'\n✅ All admin modal emojis fixed!')
