
import os
import re

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

# regex to find headers with ?
pattern = re.compile(b'(class="section-header-xl">)(\?)(.*?)<')
matches = pattern.findall(content)

print(f"Found {len(matches)} remaining ? headers:")
for m in matches:
    print(f"Match: {m[1].decode('utf-8')} {m[2].decode('utf-8', errors='replace')}")

