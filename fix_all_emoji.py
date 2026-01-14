#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Complete fix for all broken emojis and text in infografika-prompty.html"""

file_path = "modules/infografika-prompty.html"

# Read the file
with open(file_path, "r", encoding="utf-8", errors="replace") as f:
    content = f.read()

print("=== Before fixes ===")
# Check for problems
if "Vťechny" in content:
    print("Found: Vťechny (broken 'Všechny')")
if "🎓" in content:
    count = content.count("🎓")
    print(f"Found: {count} graduation cap emojis")

# Fix 1: Replace "Vťechny" with "Všechny"
content = content.replace("Vťechny", "Všechny")

# Fix 2: Replace graduation cap emoji with folder emoji in category filter
# Line 1489 pattern
content = content.replace(
    'categoryFilter.innerHTML = \'<option value="Všechny">🎓 Všechny kategorie</option>\'',
    'categoryFilter.innerHTML = \'<option value="Všechny">&#128194; Všechny kategorie</option>\''
)

# Also try without the fixed version
content = content.replace(
    '🎓 Všechny kategorie',
    '&#128194; Všechny kategorie'
)

# Fix 3: Line 1493 pattern - category options
content = content.replace(
    'option.textContent = `🎓 ${cat}`',
    'option.textContent = `&#128194; ${cat}`'
)

# Fix 4: Line 1549 - default icon in displayPrompts
content = content.replace(
    "const icon = categoryPrompts[0].icon || '🎓'",
    "const icon = categoryPrompts[0].icon || '📂'"
)

# Fix 5: Replace ALL remaining graduation cap emojis with appropriate alternatives
content = content.replace('🎓', '📂')

print("\n=== After fixes ===")
if "Vťechny" in content:
    print("Still found: Vťechny")
else:
    print("✓ Fixed: Vťechny -> Všechny")

if "🎓" in content:
    count = content.count("🎓")
    print(f"Still found: {count} graduation cap emojis")
else:
    print("✓ Fixed: All graduation cap emojis replaced")

# Write the file back
with open(file_path, "w", encoding="utf-8", newline="\r\n") as f:
    f.write(content)

print("\nFile saved successfully!")
