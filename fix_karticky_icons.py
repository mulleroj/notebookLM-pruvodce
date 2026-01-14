
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements
# 1. Copy Buttons: `?? Zkopírovat` -> `📋 Zkopírovat`
#    (Assuming ?? is literally `3f 3f`)
# 2. "?? Perfektní pro" -> `🏆 Perfektní pro` (or similar)
# 3. Footer "Výukové kartičky ??" -> `... 🃏`

replacements = {
    b'>?? Zkop\xc3\xadrovat': b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat', # 📋
    b'<h4>?? Perfektn\xc3\xad pro': b'<h4>\xf0\x9f\x8f\x86 Perfektn\xc3\xad pro', # 🏆
    b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky ??': b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky \xf0\x9f\x8🃏\x8f', # 🃏
    # Wait, hex for Joker is F0 9F 8🃏 ... F0 9F 83 8F is Joker Card? 
    # Use standard bytes for 🃏: F0 9F 83 8F (Playing Card Black Joker)
    b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky ??': b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky \xf0\x9f\x83\x8f',
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed karticky.html")
else:
    print("No changes made. Patterns might not match.")
    # Debug: Check if '?? Zkop' exists as literal bytes
    if b'?? Zkop' in content:
        print("Found '?? Zkop' literal")
    else:
        print("Did NOT find '?? Zkop' literal")

