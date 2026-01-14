#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Remove remaining corrupt bytes (replacement characters) from the file"""

file_path = "modules/infografika-prompty.html"

# Read as bytes to see what's there
with open(file_path, "rb") as f:
    content = f.read()

# Find the problematic pattern - the three boxes are likely replacement characters (0xC2 0x9F etc.)
# Common corrupt sequences we've seen: C2 9F C2 96 (mojibake from wrong encoding)

# Search for patterns after the folder emoji
# Folder emoji UTF-8: F0 9F 93 82
folder_emoji = bytes([0xF0, 0x9F, 0x93, 0x82])

# Find all positions
pos = 0
while True:
    idx = content.find(folder_emoji, pos)
    if idx == -1:
        break
    # Show what comes after
    after = content[idx:idx+20]
    print(f"Position {idx}: {after}")
    print(f"  Hex: {after.hex()}")
    pos = idx + 1

print("\n--- Looking for corrupt sequences ---")

# Corrupt sequences we've seen (from previous debug output):
# c29fc296 - these are invalid UTF-8 sequences that show as boxes

# Let's look for C2 9x patterns which are common in mojibake
import re

# First read as text
with open(file_path, "r", encoding="utf-8", errors="surrogateescape") as f:
    text = f.read()

# Count replacement chars
replacement_char = "\ufffd"
box_chars = ["\u009f", "\u0096", "\u0093", "\u0094", "\u00a4"]  # Common corrupt characters

for char in box_chars:
    count = text.count(char)
    if count > 0:
        print(f"Found {count} occurrences of U+{ord(char):04X}")

# Now let's clean up - remove these specific corrupt characters
# They appear as control characters that render as boxes
cleaned = text
for char in box_chars:
    cleaned = cleaned.replace(char, "")

# Also remove the literal replacement character
cleaned = cleaned.replace(replacement_char, "")

# Write back
with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(cleaned)

print("\nCleaned file saved!")

# Verify
with open(file_path, "r", encoding="utf-8") as f:
    verify = f.read()

remaining = sum(verify.count(char) for char in box_chars)
print(f"Remaining corrupt characters: {remaining}")
