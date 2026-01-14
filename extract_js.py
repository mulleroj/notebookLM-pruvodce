#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Extract JavaScript from HTML and save for validation"""

# Read file
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'rb') as f:
    content = f.read()

# Find script tag
script_start = content.find(b'<script>')
script_end = content.find(b'</script>', script_start)

if script_start == -1:
    print("ERROR: No <script> tag found!")
else:
    # Extract JavaScript (skip the <script> tag itself)
    js_content = content[script_start + 8:script_end]
    
    # Save to file
    with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\extracted_script.js', 'wb') as f:
        f.write(js_content)
    
    print(f"✅ Extracted {len(js_content)} bytes of JavaScript")
    print(f"Script starts at byte {script_start}, ends at {script_end}")
    
    # Try to decode and show first few lines
    try:
        decoded = js_content.decode('utf-8')
        lines = decoded.split('\n')
        print(f"\nFirst 10 lines:")
        for i, line in enumerate(lines[:10], 1):
            print(f"{i}: {line[:80]}")
    except Exception as e:
        print(f"ERROR decoding: {e}")
