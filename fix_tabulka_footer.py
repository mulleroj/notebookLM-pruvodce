
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

replacements = [
    (b'Tabulka dat ??', b'Tabulka dat \xf0\x9f\x93\xbb'), # 📋
    (b'?? Startovn\xc3\xad prompt', b'\xf0\x9f\x9a\x80 Startovn\xc3\xad prompt'), # 🚀
]

new_content = content
for bad, good in replacements:
    new_content = new_content.replace(bad, good)

# Verify no more ??
if b'??' in new_content:
    print("WARNING: Still found '??' literal")
else:
    print("Cleaned all ?? literals.")

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed footer and start prompt in tabulka-dat.html")
else:
    print("No changes made.")
