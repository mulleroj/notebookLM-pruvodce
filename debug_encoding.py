
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html'

with open(path, 'rb') as f:
    content = f.read()

# Find "Zkopírovat"
idx = content.find(b'Zkop')
if idx != -1:
    # Print surrounding bytes
    start = max(0, idx - 15)
    end = min(len(content), idx + 20)
    snippet = content[start:end]
    print(f"Hex: {snippet.hex(' ')}")
else:
    print("Not found")
