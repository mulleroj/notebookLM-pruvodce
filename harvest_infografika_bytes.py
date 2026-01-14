
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika.html'

with open(path, 'rb') as f:
    content = f.read()

def trace(marker_text, window=20):
    idx = content.find(marker_text)
    if idx != -1:
        snippet = content[max(0, idx-window):idx+len(marker_text)+5]
        print(f"snippet_{marker_text[:10].decode('utf-8', errors='replace')}: {snippet.hex(' ')}")

trace(b'?? Vizuali')
trace(b'?? Stylis')
trace(b'?? Zkop')
trace(b'?? Interak')
trace(b'?? Otev')
trace(b'Infografika ??')
