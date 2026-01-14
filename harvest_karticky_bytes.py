
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# "??" in Copy buttons
# <button class="copy-button">?? Zkopírovat</button>
# Search for `class="copy-button">??`
# But it might be `?? Zkop` or just `??` inside
# Let's search for ` Zkop` and see what precedes it.
# Also footer: `Výukové kartičky ??`

def trace(marker_text, window=20):
    idx = content.find(marker_text)
    if idx != -1:
        snippet = content[max(0, idx-window):idx+len(marker_text)+5]
        print(f"snippet_{marker_text[:5]}: {snippet.hex(' ')}")
        
trace(b' Zkop') # For copy button
trace(b' Perfektn') # "?? Perfektní pro" in Use Case 7
trace(b'karticky_footer', 0) # Manual search below

idx = content.rfind(b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky ') # Footer text
if idx != -1:
    snippet = content[idx:idx+30]
    print(f"footer: {snippet.hex(' ')}")

