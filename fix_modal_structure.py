#!/usr/bin/env python3
"""
Script to fix the admin-modal closing tags in infografika-prompty.html
The login-modal and image-modal are incorrectly nested inside admin-modal
"""

import re

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the Image Preview Modal comment and add closing tags before it
old_pattern = r'(\s*</div>\s*)\n(\s*<!-- Image Preview Modal -->)'
new_replacement = r'''\1

        </div>

    </div>

\2'''

# Use re.sub to make the replacement
new_content = re.sub(old_pattern, new_replacement, content)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("SUCCESS: Added closing </div> tags before Image Preview Modal")
else:
    print("Pattern not found, trying alternative approach...")
    
    # Alternative: Find the exact position and insert
    image_modal_comment = '<!-- Image Preview Modal -->'
    pos = content.find(image_modal_comment)
    
    if pos > 0:
        # Find the last </div> before this comment
        search_start = max(0, pos - 200)
        before_text = content[search_start:pos]
        
        # Find position right after the last </div>
        last_div_pos = before_text.rfind('</div>')
        if last_div_pos >= 0:
            insert_pos = search_start + last_div_pos + len('</div>')
            
            # Insert two closing divs
            closing_tags = '\n\n        </div>\n\n    </div>\n\n'
            new_content = content[:insert_pos] + closing_tags + content[insert_pos:]
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("SUCCESS: Inserted closing tags using alternative method")
        else:
            print("ERROR: Could not find </div> before Image Preview Modal")
    else:
        print("ERROR: Image Preview Modal comment not found")
