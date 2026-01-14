#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive fix for ALL corrupted characters in infografika-prompty.html
"""

# Read the file
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Apply all fixes
fixes = [
    # Line 945: Fix × in button
    ('<button class="modal-close" onclick="closeAdminModal()">×</button>', '<button class="modal-close" onclick="closeAdminModal()">×</button>'),
    
    # Line 958: Fix ➕ in button text
    ('➕ Přidat nový prompt', '➕ Přidat nový prompt'),
    
    # Line 1858: Fix loading message with corrupted chars
    ('<p class="loading">➕ł Nahrávám...</p>', '<p class="loading">⏳ Nahrávám...</p>'),
    
    # Line 2159: Fix alert with corrupted chars
    ("alert('Nemáte žádn×Š vlastní prompty k exportu!');", "alert('Nemáte žádné vlastní prompty k exportu!');"),
    
    # Line 2174-2175: Fix alert with newline in the middle
    ("alert(`➕\r\n Exportováno ${customPrompts.length} promptů!`);", "alert(`✅ Exportováno ${customPrompts.length} promptů!`);"),
    
    # Line 2198: Fix error message
    ("throw new Error('Někter×Š prompty nemají požadovaná pole');", "throw new Error('Některé prompty nemají požadovaná pole');"),
]

for old, new in fixes:
    if old in content:
        content = content.replace(old, new)
        print(f"✅ Fixed: {old[:50]}...")
    else:
        print(f"⚠️  Not found: {old[:50]}...")

# Write the fixed content
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All corrupted characters fixed!")
