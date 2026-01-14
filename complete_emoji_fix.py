#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete fix - replace ALL emoji with HTML entities"""

file_path = "modules/infografika-prompty.html"

with open(file_path, "rb") as f:
    data = f.read()

print(f"File size: {len(data)} bytes")

# Known emoji UTF-8 byte sequences and their HTML entity replacements
EMOJI_REPLACEMENTS = {
    # 📂 Folder - U+1F4C2
    b'\xf0\x9f\x93\x82': b'&#128194;',
    # 📋 Clipboard - U+1F4CB
    b'\xf0\x9f\x93\x8b': b'&#128203;',
    # 🖼 Framed Picture - U+1F5BC  
    b'\xf0\x9f\x96\xbc': b'&#128444;',
    # 🏠 House - U+1F3E0
    b'\xf0\x9f\x8f\xa0': b'&#127968;',
    # 🚀 Rocket - U+1F680
    b'\xf0\x9f\x9a\x80': b'&#128640;',
    # ⭐ Star - U+2B50
    b'\xe2\xad\x90': b'&#11088;',
    # ✨ Sparkles - U+2728
    b'\xe2\x9c\xa8': b'&#10024;',
    # 💡 Light Bulb - U+1F4A1
    b'\xf0\x9f\x92\xa1': b'&#128161;',
    # 🎯 Bullseye - U+1F3AF
    b'\xf0\x9f\x8e\xaf': b'&#127919;',
    # 📊 Chart - U+1F4CA
    b'\xf0\x9f\x93\x8a': b'&#128202;',
    # 🎨 Artist Palette - U+1F3A8
    b'\xf0\x9f\x8e\xa8': b'&#127912;',
}

# Also remove any stray C2 80-9F control character sequences
def remove_control_sequences(data):
    """Remove C2 8x and C2 9x sequences which are UTF-8 control characters"""
    result = bytearray()
    i = 0
    removed = 0
    while i < len(data):
        if i < len(data) - 1 and data[i] == 0xC2:
            # Check if next byte is in control character range (80-9F)
            if 0x80 <= data[i+1] <= 0x9F:
                # Skip this 2-byte sequence
                i += 2
                removed += 1
                continue
        result.append(data[i])
        i += 1
    return bytes(result), removed

# First, replace all emoji with HTML entities
new_data = data
replacement_count = 0
for emoji_bytes, entity_bytes in EMOJI_REPLACEMENTS.items():
    count = new_data.count(emoji_bytes)
    if count > 0:
        new_data = new_data.replace(emoji_bytes, entity_bytes)
        replacement_count += count
        print(f"Replaced {count}x {emoji_bytes.hex()} with {entity_bytes.decode()}")

# Then remove control character sequences
new_data, control_removed = remove_control_sequences(new_data)
print(f"Removed {control_removed} control character sequences")

# Save the fixed file
with open(file_path, "wb") as f:
    f.write(new_data)

print(f"\nTotal emoji replacements: {replacement_count}")
print(f"New file size: {len(new_data)} bytes")
print("File saved!")

# Verify - search for remaining problematic patterns
print("\n=== Verification ===")
with open(file_path, "rb") as f:
    verify_data = f.read()

# Check for any remaining C2 8x/9x
remaining_control = 0
for i in range(len(verify_data) - 1):
    if verify_data[i] == 0xC2 and 0x80 <= verify_data[i+1] <= 0x9F:
        remaining_control += 1
        
print(f"Remaining control sequences: {remaining_control}")

# Check for any remaining raw emoji bytes (there should be none if all were replaced)
for emoji_bytes in EMOJI_REPLACEMENTS.keys():
    count = verify_data.count(emoji_bytes)
    if count > 0:
        print(f"! Still has {count}x {emoji_bytes.hex()}")
