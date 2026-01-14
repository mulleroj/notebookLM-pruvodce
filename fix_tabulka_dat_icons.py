
import os
import re

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content_bytes = f.read()

# Try to decode to string for regex manipulation, assuming utf-8 valid now?
# Or works with bytes regex. Let's work with bytes to be safe against mixed encodings if any left.
# But `??` is ASCII `3f 3f`.
# `?` is ASCII `3f`.

content = content_bytes

# 1. Fix Blue Boxes (Použij / Nepoužívej)
# Search for the block structure.
# <div class="card-icon">?</div> ... <h3>Použij
# We can just replace the specific headers if we include the icon div in the search string.
# Since formatting might vary (newlines), let's use a regex or just replace known long strings if they match.
# The view_file output showed standard formatting.

patterns = [
    # Použij -> ✅
    (b'<div class="card-icon">?</div>\n                        <h3 class="card-title">Pou\xc5\xbeij', 
     b'<div class="card-icon">\xe2\x9c\x85</div>\n                        <h3 class="card-title">Pou\xc5\xbeij'),
    
    # Nepoužívej -> ❌
    (b'<div class="card-icon">?</div>\n                        <h3 class="card-title">Nepou\xc5\xbe\xc3\xadvej', 
     b'<div class="card-icon">\xe2\x9d\x8c</div>\n                        <h3 class="card-title">Nepou\xc5\xbe\xc3\xadvej'),

    # Numbered headers 1?? to 7??
    (b'1??', b'1\xef\xb8\x8f\xe2\x83\xa3'), # 1️⃣
    (b'2??', b'2\xef\xb8\x8f\xe2\x83\xa3'), # 2️⃣
    (b'3??', b'3\xef\xb8\x8f\xe2\x83\xa3'), # 3️⃣
    (b'4??', b'4\xef\xb8\x8f\xe2\x83\xa3'), # 4️⃣
    (b'5??', b'5\xef\xb8\x8f\xe2\x83\xa3'), # 5️⃣
    (b'6??', b'6\xef\xb8\x8f\xe2\x83\xa3'), # 6️⃣
    (b'7??', b'7\xef\xb8\x8f\xe2\x83\xa3'), # 7️⃣

    # Text headers
    (b'?? Typicky', b'\xf0\x9f\x91\x89 Typicky'), # 👉
    (b'?? \xc4\x8cast\xc3\xa9 chyby', b'\xe2\x9a\xa0\xef\xb8\x8f \xc4\x8cast\xc3\xa9 chyby'), # ⚠️
    (b'?? Z\xc3\xa1kladn\xc3\xad princip', b'\xf0\x9f\x94\x91 Z\xc3\xa1kladn\xc3\xad princip'), # 🔑
    (b'?? Varianta A', b'\xf0\x9f\x85\xb0\xef\xb8\x8f Varianta A'), # 🅰️
    (b'?? Varianta B', b'\xf0\x9f\x85\xb1\xef\xb8\x8f Varianta B'), # 🅱️
    (b'?? Praktick\xc3\xbd', b'\xf0\x9f\x92\xa1 Praktick\xc3\xbd'), # 💡
    (b'?? Co vznikne', b'\xe2\x9c\xa8 Co vznikne'), # ✨
    (b'?? Nejv\xc4\x9bt\xc5\xa1\xc3\xad hack', b'\xf0\x9f\x9a\x80 Nejv\xc4\x9bt\xc5\xa1\xc3\xad hack'), # 🚀
    (b'?? Jak to d\xc4\x9blat', b'\xf0\x9f\x9b\xa0\xef\xb8\x8f Jak to d\xc4\x9blat'), # 🛠️
    
    # "Zlatý řez" cards content
    (b'?? O \xc4\x8dem to je', b'\xe2\x84\xb9\xef\xb8\x8f O \xc4\x8dem to je'), # ℹ️
    (b'?? J\xc3\x81DRO V\xc3\x9dZNAMU', b'\xf0\x9f\x8e\xaf J\xc3\x81DRO V\xc3\x9dZNAMU'), # 🎯
    (b'?? KONTEXT', b'\xf0\x9f\x8c\x8d KONTEXT'), # 🌍
    (b'?? MODEL', b'\xf0\x9f\x9b\xa0\xef\xb8\x8f MODEL'), # 🛠️
    (b'?? TYPOV\xc3\x81 CHYBA', b'\xe2\x9a\xa0\xef\xb8\x8f TYPOV\xc3\x81 CHYBA'), # ⚠️
    (b'?? OTESTOVATELN\xc3\x9d', b'\xe2\x9c\x85 OTESTOVATELN\xc3\x9d'), # ✅
    (b'?? DIDAKTICK\xc3\x81', b'\xf0\x9f\xa7\xd1\xe2\x80\x8d\xf0\x9f\x8f\xab DIDAKTICK\xc3\x81'), # 🧑‍🏫

    # Global Copy Text
    (b'>?? Zkop\xc3\xadrovat', b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat'), # 📋
]

new_content = content
for bad, good in replacements:
    # Handling specific whitespace for blue boxes if exact match fails
    if bad not in new_content and b'<div class="card-icon">?' in bad:
         # Try regex for the card icon parts
         # Pattern: <div class="card-icon">?</div>\s+<h3 class="card-title">Použij
         pass # Will check after loop
    
    new_content = new_content.replace(bad, good)

# Regex fallback for Blue Boxes if exact string match failed due to whitespace
if b'<div class="card-icon">\xe2\x9c\x85</div>' not in new_content:
    # Try regex for Použij
    pattern = re.compile(b'(<div class="card-icon">)\?(</div>\s*<h3 class="card-title">Pou\xc5\xbeij)', re.DOTALL)
    new_content = pattern.sub(b'\\1\xe2\x9c\x85\\2', new_content)

if b'<div class="card-icon">\xe2\x9d\x8c</div>' not in new_content:
    # Try regex for Nepoužívej
    pattern = re.compile(b'(<div class="card-icon">)\?(</div>\s*<h3 class="card-title">Nepou\xc5\xbe\xc3\xadvej)', re.DOTALL)
    new_content = pattern.sub(b'\\1\xe2\x9d\x8c\\2', new_content)


if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed tabulka-dat.html")
else:
    print("No changes make (headers).")
