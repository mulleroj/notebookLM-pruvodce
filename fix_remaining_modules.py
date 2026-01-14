
import os

paths = [
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\audio-prehled.html'
]

replacements_map = {
    'infografika.html': [
        (b'?? Otev\xc5\x99\xc3\xad', b'\xf0\x9f\x93\x82 Otev\xc5\x99\xc3\xad') # 📂
    ],
    'audio-prehled.html': [
        (b'?? Hotov\xc3\xbd prompt', b'\xf0\x9f\x93\x8b Hotov\xc3\xbd prompt') # 📋 or 📌. Let's use 📋 for consistency with "Hotový prompt".
    ]
}

for path in paths:
    if not os.path.exists(path):
        continue
        
    filename = os.path.basename(path)
    if filename not in replacements_map:
        continue

    with open(path, 'rb') as f:
        content = f.read()
    
    new_content = content
    for bad, good in replacements_map[filename]:
        new_content = new_content.replace(bad, good)
    
    if new_content != content:
        with open(path, 'wb') as f:
            f.write(new_content)
        print(f"Fixed {filename}")
    else:
        print(f"No changes in {filename} (maybe pattern mismatch?)")
        # Debug
        if b'??' in content:
             print(f"DEBUG: ?? still in {filename}")

