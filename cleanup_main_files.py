import re
import os

# Process use-cases.html and index.html
files = [
    r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\use-cases.html",
    r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\index.html"
]

# Define replacement patterns
replacements = [
    # Margin bottom 1.5rem
    (r'style="margin-bottom: 1\.5rem;"', 'class="mb-1-5"'),
    # Footer text
    (r'style="margin-top: 0\.5rem; font-size: 0\.9rem;"', 'class="footer-text"'),
    (r'style="color: var\(--primary-blue\); text-decoration: none;"', 'class="link-primary"'),
]

def process_file(filepath):
    """Process a single HTML file and replace inline styles with CSS classes."""
    print(f"Processing: {filepath}")
    
    if not os.path.exists(filepath):
        print(f" ✗ File not found: {filepath}")
        return False
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    changes_made = 0
    
    # Apply all replacements and count changes
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
        count = len(re.findall(pattern, content, flags=re.MULTILINE))
        if count > 0:
            print(f"  - Replaced {count} instances of: {pattern[:50]}...")
            changes_made += count
        content = new_content
    
    # Check if any changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {filepath} ({changes_made} total replacements)")
        return True
    else:
        print(f"  - No changes needed for {filepath}")
        return False

def main():
    """Process all files."""
    total_updated = 0
    
    for filepath in files:
        if process_file(filepath):
            total_updated += 1
        print()
    
    print(f"✅ Complete! Updated {total_updated}/{len(files)} files.")

if __name__ == "__main__":
    main()
