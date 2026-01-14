
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# Pattern: "čky ??" -> "čky 🃏"
# čky = \xc4\x8d\x6b\x79
# ?? = \x3f\x3f
target = b'\xc4\x8d\x6b\x79 ??'
replacement = b'\xc4\x8d\x6b\x79 \xf0\x9f\x83\x8f'

if target in content:
    new_content = content.replace(target, replacement)
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed karticky.html footer")
else:
    print("Target not found. Dumping 'čky' occurrences:")
    import re
    # find all occurrences of čky followed by something
    for m in re.finditer(b'\xc4\x8d\x6b\x79.{0,10}', content):
        print(f"Match: {m.group(0).hex(' ')}")
