
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html'

with open(path, 'rb') as f:
    content = f.read()

def extract_bad_utf8_sequence(start_marker, end_marker):
    idx = content.find(start_marker)
    if idx != -1:
        end = content.find(end_marker, idx)
        if end != -1:
            snippet = content[idx:end]
            # Try to narrow down to the bad bytes (non-ascii)
            # This is heuristic
            bad = b''
            for b in snippet:
                if b > 127: bad += bytes([b])
                elif bad: break # Stop at first ascii?
            
            # Print the whole snippet hex
            print(f"snippet_{start_marker}: {snippet.hex(' ')}")

# Frame: `đŸ–źď¸ ${examples`
# Search for ` ${examples` and look back.
idx = content.find(b' ${examples')
if idx != -1:
    # 20 bytes back
    snippet = content[max(0, idx-20):idx]
    # Find the start of the button or span
    # <button ... >ICON
    # Start after >
    gt = snippet.rfind(b'>')
    if gt != -1:
        icon_bytes = snippet[gt+1:].strip()
        print(f"frame_remaining: {icon_bytes.hex(' ')}")
        
# Text Příklad: `alt="${ex.title || 'P...`
# Search for `|| 'P`
idx = content.find(b"|| 'P")
if idx != -1:
    # Capture "P...iklad'"
    end = content.find(b"'", idx+4)
    snippet = content[idx+4:end]
    print(f"priklad_remaining: {snippet.hex(' ')}")

# Folder: `\u003coption value="V...`
# `đŸ“‚ V`
idx = content.find(b' V\xc5\xa1echny') # Všechny (UTF-8? Or mojibake?)
if idx == -1:
    idx = content.find(b' V\xe2\x80\xa6') # V... something else
# Try finding "VĹĄechny"
# PĹ™ = P + c4 99?
# VĹĄ = V + c4 99? 
# Ĺ is c4 99. 
# Win-1250: š is 9A.
# 9A in Latin-1 is control (but Win-1252 is š).
# Try searching for `option value="V` and seeing what follows in the text content
regex = b'<option value="[^"]*">([^<]*)'
import re
for m in re.finditer(regex, content):
    text = m.group(1)
    # text should start with icon
    if len(text) > 0 and text[0] > 127:
        print(f"option_text_start: {text.hex(' ')} : {text[:10]}")

