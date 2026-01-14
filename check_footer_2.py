
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# Look for footer start
idx = content.rfind(b'NotebookLM Pr')
if idx != -1:
    snippet = content[idx:idx+100]
    print(f"Footer area: {snippet.hex(' ')}")
    print(f"Footer text: {snippet.decode('utf-8', errors='replace')}")
