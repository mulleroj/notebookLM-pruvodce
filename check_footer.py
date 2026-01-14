
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\karticky.html'

with open(path, 'rb') as f:
    content = f.read()

# Search for "Výukové kartičky" near the end
idx = content.rfind(b'V\xc3\xbdoukov\xc3\xa9 karti\xc4\x8dky')
if idx != -1:
    # Print 50 bytes starting from there
    snippet = content[idx:idx+50]
    print(f"Footer snippet: {snippet.hex(' ')}")
    print(f"Decoded (safe): {snippet.decode('utf-8', errors='replace')}")
else:
    print("Footer text not found!")
