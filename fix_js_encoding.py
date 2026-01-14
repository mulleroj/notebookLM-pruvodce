# -*- coding: utf-8 -*-

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix all corrupted sequences in JavaScript code
replacements = {
    # Error message - line 1198
    "'➕  Vyplňte email i heslo'": "'⚠️ Vyplňte email i heslo'",
    
    # Success alert - lines 1209-1210 (multiline)
    "alert('➕\r\n ×spěťně přihláťen jako admin!')": "alert('✅ Úspěšně přihlášen jako admin!')",
    
    # Logout modal header - line 1230
    "<h2>➕  Odhláťení</h2>": "<h2>🚪 Odhlášení</h2>",
    
    # Confirm logout button - lines 1236-1237
    "➕\r\n Ano, odhlásit": "✅ Ano, odhlásit",
    
    # Cancel button - line 1240
    "➕ Zrušit": "❌ Zrušit",
    
    # Also check for variations without \r
    "alert('➕\n ×spěťně přihláťen jako admin!')": "alert('✅ Úspěšně přihlášen jako admin!')",
    "➕\n Ano, odhlásit": "✅ Ano, odhlásit",
}

count = 0
for broken, correct in replacements.items():
    if broken in content:
        occurrences = content.count(broken)
        content = content.replace(broken, correct)
        count += occurrences
        print(f"✓ Fixed: {repr(broken)[:50]}... → {repr(correct)[:50]}... ({occurrences}x)")
    else:
        print(f"✗ Not found: {repr(broken)[:50]}...")

# Write back
with open(file_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print(f'\n✅ Total: {count} fixes applied!')
