
import os
import re

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html'

with open(path, 'rb') as f:
    content = f.read()

patterns = {
    'clipboard': b'\s*(\S+)\s*Zkop',
    'warning': b'h2>(\S+)\s*Odhl',
    'check': b'alert\(\'(\S+)', # might capture more
    'cross': b'textContent\s*=\s*`(\S+)',
}

def print_hex(name, match_bytes):
    print(f"{name}: {match_bytes.hex(' ')}")

# Manual find for clipboard
idx = content.find(b'Zkop')
if idx != -1:
    # 4 bytes before?
    snippet = content[idx-8:idx].strip()
    print_hex('clipboard_candidate', snippet)

# Manual find for warning in h2
idx = content.find(b'Odhl')
if idx != -1:
    # Look back for <h2>
    start = content.rfind(b'<h2>', 0, idx)
    if start != -1:
        snippet = content[start+4:idx].strip()
        print_hex('warning_candidate', snippet)

# Manual find for check mark
# alert('âœ
idx = content.find(b"alert('")
if idx != -1:
    end = content.find(b"\\n", idx) # It was alert('âœ\n...
    snippet = content[idx+7:end]
    print_hex('check_candidate', snippet)

