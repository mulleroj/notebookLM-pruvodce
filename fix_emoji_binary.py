#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix broken emoji by replacing graduation cap with proper HTML entities"""

file_path = "modules/infografika-prompty.html"

# Read as binary
with open(file_path, "rb") as f:
    content = f.read()

# Graduation cap emoji 🎓 in UTF-8 bytes: F0 9F 8E 93
graduation_cap = bytes([0xF0, 0x9F, 0x8E, 0x93])

# Count occurrences
count = content.count(graduation_cap)
print(f"Found {count} occurrences of graduation cap emoji")

# We need to replace them contextually:
# 1. Before "Zkopírovat prompt" -> clipboard &#128203;
# 2. Before "${examples.length}" -> camera &#128247;

# First, let's find the specific patterns and replace them

# Pattern 1: graduation cap followed by space and "Zkopírovat"
pattern1 = graduation_cap + b' Zkop'
replacement1 = b'&#128203; Zkop'
content = content.replace(pattern1, replacement1)
print(f"Replaced pattern for 'Zkopírovat prompt'")

# Pattern 2: graduation cap followed by space and "${examples.length}"
pattern2 = graduation_cap + b' ${examples.length}'
replacement2 = b'&#128247; ${examples.length}'
content = content.replace(pattern2, replacement2)
print(f"Replaced pattern for 'examples.length'")

# Also check for any other variants (with different whitespace)
# graduation cap before Zkop (with newlines)
pattern3 = graduation_cap + b'\r\n                        Zkop'
if pattern3 in content:
    replacement3 = b'&#128203;\r\n                        Zkop'
    content = content.replace(pattern3, replacement3)
    print("Replaced variant pattern 3")

# Write back
with open(file_path, "wb") as f:
    f.write(content)

print("\nDone! Emoji replaced with HTML entities.")
print("- Clipboard: &#128203;")
print("- Camera: &#128247;")

# Verify
with open(file_path, "rb") as f:
    new_content = f.read()
remaining = new_content.count(graduation_cap)
print(f"\nRemaining graduation cap emojis: {remaining}")
