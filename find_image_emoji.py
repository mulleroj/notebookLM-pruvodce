#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Fix the image emoji in toggle button"""

file_path = "modules/infografika-prompty.html"

with open(file_path, "rb") as f:
    data = f.read()

# Image/picture emoji correct UTF-8: F0 9F 96 BC (🖼)
IMAGE_EMOJI = b'\xf0\x9f\x96\xbc'

print("=== Looking for image emoji positions ===")
pos = 0
while True:
    idx = data.find(IMAGE_EMOJI, pos)
    if idx == -1:
        break
    before = data[max(0, idx-20):idx]
    after = data[idx+4:idx+20]
    print(f"Position {idx}:")
    print(f"  Before: {before}")
    print(f"  After:  {after}")
    print(f"  Hex after: {after.hex()}")
    pos = idx + 4

# Look for partial/corrupted image emoji patterns
# The frame picture emoji is U+1F5BC which is F0 9F 96 BC in UTF-8
# A corrupted version might be missing bytes

# Search for "innerHTML = '" around toggleBtn
search = b"toggleBtn.innerHTML"
idx = data.find(search)
if idx != -1:
    context = data[idx:idx+50]
    print(f"\ntoggleBtn.innerHTML found at {idx}:")
    print(f"  Content: {context}")
    print(f"  Hex: {context.hex()}")

# Also search for the C2 82 pattern which would be corruption
print("\n=== Looking for C2 82 corruption patterns ===")
for i in range(len(data) - 1):
    if data[i] == 0xC2 and data[i+1] == 0x82:
        ctx = data[max(0, i-10):i+15]
        print(f"Position {i}: {ctx}")
        print(f"  Hex: {ctx.hex()}")
