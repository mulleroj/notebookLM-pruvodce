#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix all occurrences of graduation cap emoji with proper icons"""

file_path = "modules/infografika-prompty.html"

# Read as binary
with open(file_path, "rb") as f:
    content = f.read()

# Graduation cap emoji 🎓 in UTF-8 bytes: F0 9F 8E 93
graduation_cap = bytes([0xF0, 0x9F, 0x8E, 0x93])

# The file has corrupted sequences like: f09f8e93c29fc29620
# This is graduation cap + some extra bytes + space
# Let's find all positions and see the context

positions = []
start = 0
while True:
    pos = content.find(graduation_cap, start)
    if pos == -1:
        break
    positions.append(pos)
    start = pos + 1

print(f"Found graduation cap at positions: {positions}")

# For each occurrence, look at what comes next
for pos in positions:
    context = content[pos:pos+30]
    print(f"Position {pos}: {context}")
    print(f"Hex: {context.hex()}")
    print()

# The pattern seems to be: graduation_cap + corrupt bytes + space + text
# Let's replace the whole problematic section from graduation_cap to the text

# Strategy: Replace graduation cap followed by any bytes until we hit the text
import re

# Convert to string for easier regex, handling errors
text = content.decode('utf-8', errors='replace')

# Replace pattern before "Zkopírovat prompt"
text = re.sub(r'.{1,10}Zkopírovat prompt', '&#128203; Zkopírovat prompt', text)

# Replace pattern before "${examples.length}"
text = re.sub(r'.{1,10}\$\{examples\.length\}', '&#128247; ${examples.length}', text)

# Write back
with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(text)

print("\nFile updated!")

# Verify by reading back
with open(file_path, "r", encoding="utf-8") as f:
    new_text = f.read()
    
if "&#128203; Zkopírovat" in new_text:
    print("✓ Clipboard icon found")
else:
    print("✗ Clipboard icon NOT found")
    
if "&#128247; ${examples.length}" in new_text:
    print("✓ Camera icon found")
else:
    print("✗ Camera icon NOT found")
