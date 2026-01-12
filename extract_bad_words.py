
import re

f = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-styly.html"
with open(f, 'r', encoding='utf-8') as file:
    content = file.read()

# Pattern to find words with potential corruption characters
# Common corruption starts with: Ä, Ĺ, Ă, â
pattern = re.compile(r'\S*[ÄĹĂâ]\S*')

matches = pattern.findall(content)
unique_matches = sorted(list(set(matches)))

print(f"Found {len(unique_matches)} unique corrupted sequences:")
for m in unique_matches:
    print(m)
