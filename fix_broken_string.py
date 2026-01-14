#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Fix the broken string literal on line 278
"""

# Read the file
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and fix the broken alert statement
# The problem is: alert('\n Prompt přidán!...
# Should be: alert('✅ Prompt přidán!...

# Replace the broken pattern
broken_pattern = "alert('\n Prompt přidán! Stránka se obnoví!');"
fixed_pattern = "alert('✅ Prompt přidán! Stránka se obnoví!');"

if broken_pattern in content:
    content = content.replace(broken_pattern, fixed_pattern)
    print("✅ Fixed broken alert statement")
else:
    print("⚠️  Pattern not found, trying alternative...")
    # Try to find similar patterns
    import re
    # Find alert with newline in string
    pattern = r"alert\('[\s\n]+Prompt"
    matches = list(re.finditer(pattern, content))
    print(f"Found {len(matches)} potential matches")
    
    if matches:
        # Replace the first match
        match = matches[0]
        print(f"Match at position {match.start()}: {repr(content[match.start():match.start()+50])}")
        # Fix by removing the newline
        content = re.sub(r"alert\('\s*\n\s*Prompt", "alert('✅ Prompt", content, count=1)
        print("✅ Fixed using regex")

# Write back
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ File saved!")
