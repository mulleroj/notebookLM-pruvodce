
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

def trace(marker_text, window=30):
    idx = content.find(marker_text)
    if idx != -1:
        snippet = content[max(0, idx-window):idx+len(marker_text)+5]
        print(f"snippet_{marker_text[:10].decode('utf-8', errors='replace')}: {snippet.hex(' ')}")

trace(b'class="card-icon">?') # Blue boxes
trace(b'1??')
trace(b'2??')
trace(b'?? Typicky')
trace(b'?? Varianta A')
trace(b'?? J\xc3\x81DRO')
trace(b'?? Co vznikne')
