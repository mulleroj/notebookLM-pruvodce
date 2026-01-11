# -*- coding: utf-8 -*-
"""
Fix UTF-8 Encoding for Module Pages
Converts HTML files from Windows-1250 to UTF-8 encoding
"""

import os
import codecs

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
    "modules/tabulka-dat.html"
]

converted_count = 0
error_count = 0

for file_path in files:
    if os.path.exists(file_path):
        try:
            print(f"Converting {file_path} to UTF-8...")
            
            # Try reading with different encodings
            content = None
            for encoding in ['windows-1250', 'cp1250', 'iso-8859-2', 'latin2']:
                try:
                    with codecs.open(file_path, 'r', encoding=encoding) as f:
                        content = f.read()
                    print(f"  ✓ Read with {encoding}")
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                print(f"  ⚠ Could not determine encoding for {file_path}")
                error_count += 1
                continue
            
            # Write as UTF-8 with BOM
            with codecs.open(file_path, 'w', encoding='utf-8-sig') as f:
                f.write(content)
            
            print(f"  ✓ Converted {file_path}")
            converted_count += 1
            
        except Exception as e:
            print(f"  ✗ Error converting {file_path}: {e}")
            error_count += 1
    else:
        print(f"  ⚠ File not found: {file_path}")

print(f"\n✅ Encoding conversion complete!")
print(f"   Converted: {converted_count} files")
print(f"   Errors: {error_count} files")
