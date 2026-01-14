# -*- coding: utf-8 -*-
import re

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

# Read file
with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
    content = f.read()

# Find and fix all instances with regex patterns
fixes = [
    # Fix error message with warning emoji
    (r"errorDiv\.textContent = '[^']*Vyplňte email i heslo'", 
     "errorDiv.textContent = '⚠️ Vyplňte email i heslo'"),
    
    # Fix success alert
    (r"alert\('[^']*přihl[^']*admin!'\)", 
     "alert('✅ Úspěšně přihlášen jako admin!')"),
    
    # Fix logout modal header
    (r"<h2>[^<]*Odhl[^<]*</h2>",
     "<h2>🚪 Odhlášení</h2>"),
    
    # Fix confirm logout button text
    (r"(confirm-logout-btn[^>]*>)\s*[^A]*Ano, odhlásit",
     r"\1\n                                ✅ Ano, odhlásit"),
    
    # Fix cancel button text  
    (r"(cancel-logout-btn[^>]*>)\s*[^Z]*Zrušit",
     r"\1\n                                ❌ Zrušit"),
]

count = 0
for pattern, replacement in fixes:
    matches = re.findall(pattern, content)
    if matches:
        content = re.sub(pattern, replacement, content)
        count += len(matches)
        print(f"✓ Fixed pattern: {pattern[:40]}... ({len(matches)}x)")
        for match in matches[:2]:  # Show first 2 matches
            print(f"  Found: {repr(match)[:60]}...")
    else:
        print(f"✗ No match for: {pattern[:40]}...")

# Write back
with open(file_path, 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(content)

print(f'\n✅ Total: {count} fixes applied!')
