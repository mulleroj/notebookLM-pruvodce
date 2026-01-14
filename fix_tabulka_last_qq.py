
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

replacements = [
    (b'?? Univerz\xc3\xa1ln\xc3\xad meta-prompt', b'\xe2\x9c\xa8 Univerz\xc3\xa1ln\xc3\xad meta-prompt'), # ✨
]

new_content = content
for bad, good in replacements:
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed final (really) remnant in tabulka-dat.html")
else:
    print("No changes made.")

if b'??' in new_content:
    print("STILL FOUND ??")
else:
    print("CLEAN")
