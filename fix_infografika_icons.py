
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements
replacements = {
    # List items in Ideální situace
    b'<li>?? <strong>': b'<li>\xe2\x9c\x85 <strong>', # ✅
    
    # CTAs
    b'<strong>?? Stylistick\xc3\xbd': b'<strong>\xf0\x9f\x8e\xa8 Stylistick\xc3\xbd', # 🎨
    b'link">\n                ?? Zobrazit katalog': b'link">\n                \xf0\x9f\x93\x96 Zobrazit katalog', # 📖
    
    b'<strong>?? Interaktivn\xc3\xad': b'<strong>\xf0\x9f\x97\x83\xef\xb8\x8f Interaktivn\xc3\xad', # 🗃️
    b'link">\n                    ?? Otev\xc5\x99\xc3\xadit': b'link">\n                    \xf0\x9f\x93\x82 Otev\xc5\x99\xc3\xadit', # 📂
    
    # Copy Buttons
    b'>?? Zkop\xc3\xadrovat': b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat', # 📋
    
    # Footer
    b'Infografika ??</p>': b'Infografika \xf0\x9f\x8e\xa8</p>', # 🎨
    
    # In TOP 10 Cards - "?? Zkopírovat" is handled by the global Copy Button replacement.
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

# Check for missed "?? Zobrazit" (newlines might vary)
# Manual check for strict bytes finding might be safer if newlines differ.
# But view_file showed newlines.

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed infografika.html")
else:
    print("No changes made. Patterns might not match.")
    
    # Debug
    if b'?? Stylis' in content: print("Found ?? Stylis literal")
