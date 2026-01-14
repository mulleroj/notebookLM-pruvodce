
import os

files_to_fix = [
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\audio-prompty.html'
]

# Replacement Map (Bad Bytes -> Good Bytes)
replacements = {
    # Clipboard 📋 (F0 9F 93 8B)
    b'\xc4\x91\xc2\x9f\xc2\x93\xc2\x8b': b'\xf0\x9f\x93\x8b',
    
    # Trash 🗑️ (F0 9F 97 91 EF B8 8F)
    b'\xc2\x97\xc2\x91\xc4\x8f\xc2\xb8\xc2\x8f': b'\xf0\x9f\x97\x91\xef\xb8\x8f', # Matches Harvest
    
    # Frame 🖼️ (F0 9F 96 BC EF B8 8F)
    b'\xc4\x91\xc2\x96\xc2\xbc\xc4\x8f\xc2\xb8\xc2\x8f': b'\xf0\x9f\x96\xbc\xef\xb8\x8f',
    
    # Warning ⚠️ (E2 9A A0 EF B8 8F)
    # Mix of Win-1250/Latin-1 mappings
    b'\xc3\xa2\xc5\xa1\xc2\xa0\xc4\x8f\xc2\xb8': b'\xe2\x9a\xa0\xef\xb8\x8f', 
    b'\xc3\xa2\xc5\xa1\xc2\xa0\xc4\x8f\xc2\xb8\xc2\x8f': b'\xe2\x9a\xa0\xef\xb8\x8f', # With 8F
    
    # Pencil ✏️ (E2 9C 8F EF B8 8F)
    b'\xc3\xa2\xc2\x9c\xc2\x8f\xc4\x8f\xc2\xb8\xc2\x8f': b'\xe2\x9c\x8f\xef\xb8\x8f',
    
    # Check ✅ (E2 9C 85)
    b'\xc3\xa2\xc2\x9c\xc2\x85': b'\xe2\x9c\x85',
    
    # Waving 👋 (F0 9F 91 8B)
    b'\xc4\x91\xc2\x9f\xc2\x91\xc2\x8b': b'\xf0\x9f\x91\x8b',
    
    # Folder 📂 (F0 9F 93 82)
    b'\xc4\x91\xc2\x9f\xc2\x93\xc2\x82': b'\xf0\x9f\x93\x82',
    
    # Pin 📌 (F0 9F 93 8C)
    b'\xc4\x91\xc2\x9f\xc2\x93\xc2\x8c': b'\xf0\x9f\x93\x8c',
    
    # Cross ❌ (E2 9D 8C)
    b'\xc3\xa2\xc5\xa5\xc2\x8c': b'\xe2\x9d\x8c', # 9D is ť (c5 a5) in 1250
    b'\xc3\xa2\xc2\x9d\xc2\x8c': b'\xe2\x9d\x8c', # Fallback if 9D (c2 9d)

    # Hourglass ⏳ (E2 8C 9B)
    b'\xc3\xa2\xc5\x9a\xc5\xa5': b'\xe2\x8c\x9b', # 8C is Ś (c5 9a) in 1250, 9B is ť (c5 a5) in 1250
    b'\xe2\x88\x91': b'\xe2\x8c\x9b', # Another mojibake possibility (âˆ‘ is ∑) - 8859-1 E2 = â, 8C = ?, 9B = ?

    # Plus ➕ (E2 9E 95)
    b'\xc3\xa2\xc5\xbe\xe2\x80\xa2': b'\xe2\x9e\x95', # 9E is ž (c5 be) in 1250. 95 is • (bullet) in 1250 (e2 80 a2)
    
     # Bulb 💡 (F0 9F 92 A1)
    b'\xc4\x91\xc2\x9f\xc2\x92\xc2\xa1': b'\xf0\x9f\x92\xa1',

    # Also fix some text if possible
    b'\xc4\x82\xc5\xa1p\xc4\x82\xc2\x9b\xc4\x81\xc2\xa4n\xc4\x82\xc2\x9b': b'\xc3\x9a\x73\x70\xc4\x9b\xc5\xa1\x6e\xc4\x9b', # Úspěšně (Garbage guess)
    # "ĂšpÄ›ĹĄnÄ›"
    # Ă (C4 82) š (C5 A1) p Ä (C4 84) › (E2 80 BA) ...
    # Let's rely on standard UTF-8 replace for text if the icon bytes don't cover it.
    
    # Correcting known text patterns:
    # "Úspěšně" is often garbled.
    # The string "ĂšspÄ›ĹĄnÄ›" seen in view_file.
    # utf-8 bytes for that: c4 82 c5 a1 70 c4 84 ...
    # Replace the byte sequence for "ĂšspÄ›ĹĄnÄ›" with utf-8 "Úspěšně"
    b'\xc4\x82\xc5\xa1p\xc3\x84\xe2\x80\xba\xc4\xb9\xc5\xa1n\xc3\x84\xe2\x80\xba': b'\xc3\x9a\x73\x70\xc4\x9b\xc5\xa1\x6e\xc4\x9b', # Attempt
}

def fix_file(path):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return

    with open(path, 'rb') as f:
        content = f.read()
    
    original_content = content
    for bad, good in replacements.items():
         content = content.replace(bad, good)
    
    # Also generic text fix?
    # Replace "âœ\n" with "\xe2\x9c\x85\n" (Check)
    # Check mark might be partial.
    content = content.replace(b'\xe2\x9c\x0a', b'\xe2\x9c\x85\x0a') # âœ\n -> ✅\n
    
    if content != original_content:
        with open(path, 'wb') as f:
            f.write(content)
        print(f"Fixed bytes in {path}")
    else:
        print(f"No changes in {path}")

if __name__ == "__main__":
    for f in files_to_fix:
        fix_file(f)
