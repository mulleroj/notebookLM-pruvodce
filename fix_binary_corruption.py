#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Final fix for corrupted bytes on line 958
"""

# Read the file as binary
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'rb') as f:
    content = f.read()

# Remove the specific corrupted bytes
# \x9e and \x95 are invalid UTF-8 sequences
content = content.replace(b'\x9e', b'')
content = content.replace(b'\x95', b'')
content = content.replace(b'\x8f', b'')  # Also found on line 1858
content = content.replace(b'\x9c', b'')  # Also found on line 2174

# Write back
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'wb') as f:
    f.write(content)

print("✅ Removed all corrupted bytes!")

# Verify
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'rb') as f:
    content = f.read()
    
# Check for any remaining invalid bytes
invalid_bytes = [b'\x8f', b'\x9c', b'\x9e', b'\x95']
found = []
for byte in invalid_bytes:
    if byte in content:
        found.append(byte.hex())

if found:
    print(f"⚠️  Still found: {found}")
else:
    print("✅ All corrupted bytes removed!")
