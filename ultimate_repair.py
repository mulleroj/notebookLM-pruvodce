# -*- coding: utf-8 -*-
import os
import codecs
import re

def fix_mangled(text):
    """
    Tries to fix a string that was incorrectly decoded as CP1250 and then saved as UTF-8.
    It can handle multiple levels of mangling.
    """
    current = text
    while True:
        try:
            # Try to reverse one level of CP1250 mangling
            # We encode to bytes using CP1250 (as it was originally interpreted)
            # and then decode as UTF-8 (as it was originally supposed to be)
            raw_bytes = current.encode('cp1250', errors='strict')
            repaired = raw_bytes.decode('utf-8', errors='strict')
            
            # If we got something different, try to go deeper (for double mangling)
            if repaired != current:
                # Basic check to avoid infinite loops or total garbage
                if len(repaired) < len(current): # UTF-8 bytes to chars usually reduces length
                     current = repaired
                     continue
            break
        except:
            # If any step fails, we've reached the limit of what we can fix this way
            break
    return current

def process_file(file_path):
    if not os.path.exists(file_path):
        return
    
    print(f"Processing {file_path}...")
    with codecs.open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # We try to fix the content by identifying "messy" blocks
    # or just try it line by line
    lines = content.splitlines()
    new_lines = []
    
    for line in lines:
        # Only try to fix if there are "mangled-looking" characters
        # Many mangled chars are in the C4-C5 range or have high CP1250 values
        if any(ord(c) > 127 for c in line):
            fixed_line = fix_mangled(line)
            new_lines.append(fixed_line)
        else:
            new_lines.append(line)
            
    new_content = "\n".join(new_lines)
    
    if new_content != content:
        # Save as UTF-8 with BOM
        with codecs.open(file_path, 'w', encoding='utf-8-sig') as f:
            f.write(new_content)
        print("  ✓ Fixed.")
    else:
        print("  No changes detected.")

files = [
    "modules/audio-prehled.html",
    "modules/video-prehled.html",
    "modules/myslenkova-mapa.html",
    "modules/audio-prompty.html",
    "modules/video-prompty.html",
    "modules/karticky.html",
    "modules/quiz.html",
    "modules/infografika.html",
    "modules/infografika-styly.html",
    "modules/infografika-prompty.html",
    "modules/prezentace.html",
    "modules/prezentace-prompty.html",
    "modules/tabulka-dat.html",
    "modules/zpravy-prehled.html",
    "troubleshooting.html",
    "spu-adhd.html",
    "use-cases.html",
    "jak-zacit.html",
    "index.html"
]

for f in files:
    process_file(f)

print("\nRepair complete!")
