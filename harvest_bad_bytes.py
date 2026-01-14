
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html'

with open(path, 'rb') as f:
    content = f.read()

def find_icon_before(anchor, name):
    idx = content.find(anchor)
    if idx != -1:
        # scan back for " or ' or >
        start = idx
        while start > idx - 20: 
            if content[start-1] in b" >'\"":
                break
            start -= 1
        snippet = content[start:idx]
        print(f"{name}: {snippet.hex(' ')}")

find_icon_before(b' Zkop', 'clipboard')
find_icon_before(b' Smazat', 'trash')
find_icon_before(b' Upravit', 'pencil')

# Check: alert('...
# The text might be corrupted (mojibake). "Úspěšně"
# Search for "sp" followed by "n" with some bytes in between.
# Or just search for the start of the alert.
# The code has `alert('` then `ICON ...`.
# Find all alerts
import re
for m in re.finditer(b"alert\('([^']*)'\)", content):
    payload = m.group(1)
    # Check if payload starts with high bytes
    if len(payload) > 0 and payload[0] > 127:
        # Extract potential icon (first few bytes until space)
        parts = payload.split(b' ')
        print(f"alert_start: {parts[0].hex(' ')}")

# Warning Login: "Vypl"
find_icon_before(b' Vypl', 'warning_login')

# Frame: " ${examples"
# button content: ICON ${examples.length}
# Search for ` ${examples`
find_icon_before(b' ${examples', 'frame')

# Waving: " odhl"
# Before " odhl" (odhlášen) there is "Úspěšně". 
# The icon is before "Úspěšně".
# "Úspěšně" is likely `Ăšsp...` -> `c3 83 c5 a1`...
# Let's search for " odhl"
idx = content.find(b' odhl')
if idx != -1:
    # "Úspěšně" precedes it.
    # Scan back across "Úspěšně" to find icon.
    # We can just print the 30 bytes before " odhl"
    start = max(0, idx - 30)
    print(f"waving_context: {content[start:idx].hex(' ')}")

# Hourglass: " Na" (Načítám)
# .innerHTML = '... Načítám
idx = content.find(b' Na\xc4\x8d') # Nač (utf-8 valid) or Na\xc4\x8d (if valid)
if idx == -1:
    idx = content.find(b' Na')
    # check if "Načítám" or corrupted version
if idx != -1:
    start = max(0, idx - 15)
    print(f"hourglass_context: {content[start:idx].hex(' ')}")

