
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\myslenkova-mapa.html'

with open(path, 'rb') as f:
    content = f.read()

def extract_bad_utf8_sequence(start_marker, end_marker):
    idx = content.find(start_marker)
    if idx != -1:
        end = content.find(end_marker, idx)
        if end != -1:
            snippet = content[idx:end]
            print(f"snippet_{start_marker[:10]}: {snippet.hex(' ')}")

# "?? Začátek"
idx = content.find(b' Za\xc4\x8d\xc3\xa1tek')
if idx != -1:
    # Look back for whatever is replacing `??`
    # In file view it shows `??`, which likely means `3f 3f` or something that decodes to `??` in Python view_file
    # But often view_file replaces non-decodable bytes with  or ?
    # Let's inspect the raw bytes before " Začátek"
    snippet = content[max(0, idx-10):idx]
    print(f"bullet_start: {snippet.hex(' ')}")

# "?? Nejlep"
idx = content.find(b' Nejlep')
if idx != -1:
    snippet = content[max(0, idx-10):idx]
    print(f"h4_best_for: {snippet.hex(' ')}")

# "?? Praktick"
idx = content.find(b' Praktick')
if idx != -1:
    snippet = content[max(0, idx-10):idx]
    print(f"example_title: {snippet.hex(' ')}")

# Footer "Myšlenková mapa ??"
# Search for `Myšlenková mapa ` at the end
idx = content.rfind(b'My\xc5\xa1lenkov\xc3\xa1 mapa ')
if idx != -1:
    snippet = content[idx+18:idx+30]
    print(f"footer_icon: {snippet.hex(' ')}")
