#!/usr/bin/env python3
"""
Fix the static prompt counter values in prompt database pages.
Changes '33' to '0' for initial display, and ensures JS properly updates them.
"""

import re

pages = [
    'prezentace-prompty.html',
    'video-prompty.html', 
    'audio-prompty.html'
]

modules_dir = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules'

for page in pages:
    filepath = f'{modules_dir}\\{page}'
    print(f"Processing {page}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace static '33' in total-prompts span
    # Pattern: id="total-prompts">33</span>
    content = re.sub(
        r'(id="total-prompts">)\d+(<)',
        r'\g<1>0\g<2>',
        content
    )
    
    # Replace static '33' in visible-prompts span
    # Pattern: id="visible-prompts">33</span>
    content = re.sub(
        r'(id="visible-prompts">)\d+(<)',
        r'\g<1>0\g<2>',
        content
    )
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"  Fixed counter values in {page}")

print("\nDone! All pages now show 0 initially and will be updated by JavaScript.")
