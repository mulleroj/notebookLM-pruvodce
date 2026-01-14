
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements
replacements = {
    b'>?? Zkop\xc3\xadrovat': b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat', # 📋
    b'<h4>?? Perfektn\xc3\xad pro': b'<h4>\xf0\x9f\x8f\x86 Perfektn\xc3\xad pro', # 🏆
    b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky ??': b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky \xf0\x9f\x83\x8f', # 🃏
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed karticky.html")
else:
    print("No changes made. Patterns might not match.")
    if b'?? Zkop' in content:
        print("Found '?? Zkop' literal")
    else:
        print("Did NOT find '?? Zkop' literal")
        # Locate what is there
        idx = content.find(b' Zkop')
        if idx != -1:
             print(f"Around Zkop: {content[idx-10:idx+10].hex(' ')}")
