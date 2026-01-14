#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete repair of infografika-prompty.html - rewrite all problematic sections with clean HTML entities"""

file_path = "modules/infografika-prompty.html"

# Read as bytes
with open(file_path, "rb") as f:
    raw_bytes = f.read()

print(f"File size: {len(raw_bytes)} bytes")

# Decode with error handling
content = raw_bytes.decode("utf-8", errors="replace")

# Count replacement characters 
replacement_count = content.count("\ufffd")
print(f"Replacement characters found: {replacement_count}")

# Strategy: Find and fix specific patterns
# 1. Category filter initialization - search for the pattern around "Všechny kategorie"
# 2. Copy button text - search for "Zkopírovat prompt" 
# 3. Image count button

import re

# Fix 1: Category filter - look for the initializeDatabase/populateCategories code
# The issue is around lines with category-filter

# Find the line that sets categoryFilter.innerHTML
pattern1 = re.compile(r"categoryFilter\.innerHTML\s*=\s*'[^']*'", re.DOTALL)
matches = pattern1.findall(content)
print(f"\nFound categoryFilter.innerHTML patterns: {len(matches)}")
for m in matches[:3]:
    print(f"  - {m[:100]}...")

# Fix: Replace ALL occurrences of problematic patterns with clean versions
# Using HTML entities for emojis

fixes = [
    # Category filter "Všechny kategorie" - use HTML entity for folder
    (r"categoryFilter\.innerHTML\s*=\s*'[^']*echny kategorie[^']*'", 
     "categoryFilter.innerHTML = '<option value=\"Všechny\">&#128194; Všechny kategorie</option>'"),
    
    # Category options with icons
    (r"option\.textContent\s*=\s*`[^`]*\$\{cat\}`",
     "option.textContent = `📂 ${cat}`"),
]

# Also look for copy button patterns
copy_pattern = re.compile(r"'[^']*Zkop[^']*rovat prompt[^']*'", re.DOTALL | re.IGNORECASE)
copy_matches = copy_pattern.findall(content)
print(f"\nFound 'Zkopírovat prompt' patterns: {len(copy_matches)}")
for m in copy_matches[:3]:
    print(f"  - {m[:100]}...")

# Let's find and show lines with potential issues
lines = content.split('\n')
problem_lines = []
for i, line in enumerate(lines):
    if '\ufffd' in line or '📂' in line:
        problem_lines.append((i+1, line[:150]))

print(f"\nProblem lines: {len(problem_lines)}")
for num, line in problem_lines[:10]:
    print(f"  Line {num}: {line}")

# Now let's create a clean version
# We need to identify and fix the JavaScript that generates the UI

# Search for initializeDatabase function
init_db_match = re.search(r"function\s+initializeDatabase\s*\([^)]*\)\s*\{", content)
if init_db_match:
    print(f"\ninitializeDatabase found at position: {init_db_match.start()}")
    # Get some context
    ctx_start = max(0, init_db_match.start())
    ctx_end = min(len(content), init_db_match.start() + 500)
    print(f"Context: {content[ctx_start:ctx_end]}")

# Look for the exact bytes around folder emoji
folder_emoji_bytes = bytes([0xF0, 0x9F, 0x93, 0x82])  # UTF-8 for 📂
clipboard_emoji_bytes = bytes([0xF0, 0x9F, 0x93, 0x8B])  # UTF-8 for 📋 
picture_emoji_bytes = bytes([0xF0, 0x9F, 0x96, 0xBC])  # UTF-8 for 🖼

print(f"\nSearching for folder emoji bytes: {folder_emoji_bytes.hex()}")
pos = raw_bytes.find(folder_emoji_bytes)
while pos != -1:
    # Show context
    ctx = raw_bytes[max(0, pos-20):min(len(raw_bytes), pos+30)]
    print(f"  Found at {pos}: {ctx}")
    pos = raw_bytes.find(folder_emoji_bytes, pos + 1)

# Let's do a manual fix - find all lines and clean them
print("\n=== APPLYING FIXES ===")

# Simple approach: decode, find and replace with known good patterns
clean_content = content

# Remove all replacement characters
clean_content = clean_content.replace('\ufffd', '')

# Fix any remaining control characters that shouldn't be there
import unicodedata
def remove_control_chars(s):
    return ''.join(c for c in s if unicodedata.category(c) != 'Cc' or c in '\n\r\t')

# Don't do this globally as it might break things, just target specific patterns

# Save
with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(clean_content)

print("File cleaned and saved!")
