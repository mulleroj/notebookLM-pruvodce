
import os

files_to_fix = [
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\audio-prompty.html'
]

replacements = {
    # Frame 🖼️ (F0 9F 96 BC EF B8 8F) - using shorter prefix to match
    b'\xc4\x91\xc2\x96\xc2\xbc\xc4\x8f\xc2\xb8': b'\xf0\x9f\x96\xbc\xef\xb8\x8f',
    
    # Příklad (Příklad)
    b'\x50\xc4\xb9\xc2\x99\xc3\xad\x6b': b'P\xc5\x99\xc3\xadk', 
    
    # Fix the trailing garbage for frame if needed? 
    # The short prefix replace might leave 'c2 8f' hanging.
    # But browsers usually ignore stray bytes or make '?'
    # Better to be precise if possible.
    # Harvest: c4 91 c2 96 c2 bc c4 8f c2 b8 c2 8f
    # Target: f0 9f 96 bc ef b8 8f
    b'\xc4\x91\xc2\x96\xc2\xbc\xc4\x8f\xc2\xb8\xc2\x8f': b'\xf0\x9f\x96\xbc\xef\xb8\x8f',
}

def fix_file(path):
    if not os.path.exists(path):
        return

    with open(path, 'rb') as f:
        content = f.read()
    
    original_content = content
    for bad, good in replacements.items():
         content = content.replace(bad, good)
    
    if content != original_content:
        with open(path, 'wb') as f:
            f.write(content)
        print(f"Fixed {path}")

if __name__ == "__main__":
    for f in files_to_fix:
        fix_file(f)
