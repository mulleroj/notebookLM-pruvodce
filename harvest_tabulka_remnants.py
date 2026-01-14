
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

def trace(marker_text, window=30):
    idx = content.find(marker_text)
    if idx != -1:
        snippet = content[max(0, idx-window):idx+len(marker_text)+5]
        print(f"snippet_{marker_text[:10].decode('utf-8', errors='replace')}: {snippet.hex(' ')}")
    else:
        print(f"Not found: {marker_text}")

trace(b'? Varianta B')
trace(b'? Pro\xc4\x8d to funguje') # ? Proč to funguje
trace(b'>? Varianta B') # Header tag might be immediately before
trace(b'>? Pro\xc4\x8d')
