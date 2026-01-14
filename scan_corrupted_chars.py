#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deep scan for corrupted characters in infografika-prompty.html
"""

import re

# Read the file
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

print("Scanning for corrupted characters...\n")

corrupted_lines = []
for i, line in enumerate(lines, 1):
    # Look for suspicious character sequences
    if any(char in line for char in ['➕', 'ť', 'ź', '×', 'Š', 'ł']):
        corrupted_lines.append((i, line.strip()))
        print(f"Line {i}: {line.strip()[:100]}")

print(f"\nFound {len(corrupted_lines)} lines with corrupted characters")

# Show specific problem areas
print("\n=== Detailed Analysis ===")
for line_num, content in corrupted_lines:
    # Show hex representation of suspicious characters
    suspicious = []
    for char in content:
        if ord(char) > 127 and char not in ['č', 'ř', 'š', 'ž', 'ý', 'á', 'í', 'é', 'ú', 'ů', 'ň', 'ď', 'ť', 'Č', 'Ř', 'Š', 'Ž', 'Ý', 'Á', 'Í', 'É', 'Ú', 'Ů', 'Ň', 'Ď', 'Ť', '🎓', '📋', '🖼️', '⏳', '✅', '❌']:
            suspicious.append(f"{char}(U+{ord(char):04X})")
    if suspicious:
        print(f"Line {line_num}: {', '.join(suspicious[:5])}")
