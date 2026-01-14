
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements
replacements = {
    b'<h4>?? Ide\xc3\xa1ln\xc3\xad': b'<h4>\xf0\x9f\x93\x8c Ide\xc3\xa1ln\xc3\xad', # 📌
    b'>?? Zkop\xc3\xadrovat': b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat', # 📋
    b'Prezentace ??</p>': b'Prezentace \xf0\x9f\x93\xbd</p>', # 📽️
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed prezentace.html")
else:
    print("No changes made.")
    # Debug
    if b'?? Ide' in content: print("Found ?? Ide literal")
