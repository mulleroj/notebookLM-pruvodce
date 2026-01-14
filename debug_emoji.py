#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix broken emoji by replacing with HTML entities using binary search"""

file_path = "modules/infografika-prompty.html"

# Read as binary to see exact bytes
with open(file_path, "rb") as f:
    content = f.read()

# Print problematic area around "Zkopírovat prompt" for debugging
idx = content.find(b"Zkop")
if idx != -1:
    print("Bytes around 'Zkopírovat prompt':")
    print(content[idx-20:idx+30])
    print("Hex:", content[idx-20:idx+30].hex())

# Find btn-toggle-examples area
idx2 = content.find(b"btn-toggle-examples")
if idx2 != -1:
    print("\nBytes around 'btn-toggle-examples':")
    print(content[idx2:idx2+100])
    print("Hex:", content[idx2:idx2+100].hex())

# Now let's find and replace any problematic emoji patterns
# The graduation cap emoji 🎓 in UTF-8 is: F0 9F 8E 93
# We'll replace with HTML entities

# Find all occurrences of the broken emoji before "Zkopírovat" and before "${examples.length}"
# Let's check what bytes are there

# Pattern 1: before "Zkopírovat prompt"
pattern1_start = content.find(b'btn-copy"')
if pattern1_start != -1:
    # Find the closing > of the button tag
    btn_end = content.find(b'>', pattern1_start)
    if btn_end != -1:
        # Find Zkopírovat
        zkop = content.find(b'Zkop', btn_end)
        if zkop != -1:
            problematic_section = content[btn_end:zkop]
            print(f"\nSection between btn-copy > and Zkop: {problematic_section}")
            print(f"Hex: {problematic_section.hex()}")

# Pattern 2: before "${examples.length}"
pattern2 = content.find(b'${examples.length}')
if pattern2 != -1:
    problematic_section2 = content[pattern2-30:pattern2]
    print(f"\nSection before ${{examples.length}}: {problematic_section2}")  
    print(f"Hex: {problematic_section2.hex()}")
