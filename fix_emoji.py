#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix broken emoji in infografika-prompty.html"""

import re

file_path = "modules/infografika-prompty.html"

# Read the file
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Find and replace the button lines - use regex to match any character before "Zkopírovat prompt"
# and any character before "${examples.length}"

# Fix copy button - replace any emoji/character before "Zkopírovat prompt" with clipboard
content = re.sub(
    r'(<button class="btn-copy"[^>]*>)\s*.\s*Zkopírovat prompt',
    r'\1\n                        📋 Zkopírovat prompt',
    content
)

# Fix examples button - replace any emoji/character before "${examples.length}" with camera
content = re.sub(
    r'(<button class="btn-toggle-examples"[^>]*>)\s*.\s*\$\{examples\.length\}',
    r'\1\n                            📷 ${examples.length}',
    content
)

# Write the file back
with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(content)

print("Emoji successfully fixed!")
print("- Copy button: 📋")
print("- Images button: 📷")
