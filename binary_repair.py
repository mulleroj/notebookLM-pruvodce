#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Direct binary repair - find and fix corrupted emoji sequences"""

file_path = "modules/infografika-prompty.html"

with open(file_path, "rb") as f:
    data = f.read()

print(f"File size: {len(data)} bytes")

# Known good UTF-8 emoji sequences
FOLDER_EMOJI = b'\xf0\x9f\x93\x82'  # 📂
CLIPBOARD_EMOJI = b'\xf0\x9f\x93\x8b'  # 📋
IMAGE_EMOJI = b'\xf0\x9f\x96\xbc'  # 🖼

# Find all positions of folder emoji and show context
print("\n=== Folder emoji positions ===")
pos = 0
folder_positions = []
while True:
    idx = data.find(FOLDER_EMOJI, pos)
    if idx == -1:
        break
    folder_positions.append(idx)
    # Show 10 bytes before and 10 bytes after
    before = data[max(0, idx-10):idx]
    after = data[idx+4:idx+14]
    print(f"Position {idx}:")
    print(f"  Before: {before.hex()} ({before})")
    print(f"  After:  {after.hex()} ({after})")
    pos = idx + 4

print("\n=== Clipboard emoji positions ===")
pos = 0
clipboard_positions = []
while True:
    idx = data.find(CLIPBOARD_EMOJI, pos)
    if idx == -1:
        break
    clipboard_positions.append(idx)
    before = data[max(0, idx-10):idx]
    after = data[idx+4:idx+14]
    print(f"Position {idx}:")
    print(f"  Before: {before.hex()} ({before})")
    print(f"  After:  {after.hex()} ({after})")
    pos = idx + 4

# Look for C2 9x sequences which are common mojibake
print("\n=== Looking for C2 9x pattern (control chars) ===")
c2_positions = []
for i in range(len(data) - 1):
    if data[i] == 0xC2 and (data[i+1] >= 0x80 and data[i+1] <= 0x9F):
        c2_positions.append(i)
        ctx = data[max(0,i-5):i+10]
        print(f"Position {i}: {ctx.hex()}")

print(f"\nTotal C2 9x patterns found: {len(c2_positions)}")

# These C2 8x/9x sequences are control characters in UTF-8 that display as boxes
# They should be removed
if c2_positions:
    print("\n=== Removing C2 80-9F control character sequences ===")
    new_data = bytearray()
    i = 0
    skip_count = 0
    while i < len(data):
        if i < len(data) - 1 and data[i] == 0xC2 and (data[i+1] >= 0x80 and data[i+1] <= 0x9F):
            # Skip this 2-byte control character sequence
            i += 2
            skip_count += 1
        else:
            new_data.append(data[i])
            i += 1
    
    print(f"Removed {skip_count} control character sequences")
    
    # Save the cleaned file
    with open(file_path, "wb") as f:
        f.write(bytes(new_data))
    
    print("File saved!")
else:
    print("No C2 9x control characters found - file may already be clean")

# Verify
with open(file_path, "rb") as f:
    verify_data = f.read()

# Check for remaining C2 9x
remaining = 0
for i in range(len(verify_data) - 1):
    if verify_data[i] == 0xC2 and (verify_data[i+1] >= 0x80 and verify_data[i+1] <= 0x9F):
        remaining += 1

print(f"\nRemaining C2 9x patterns: {remaining}")
