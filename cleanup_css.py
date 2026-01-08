import re
import os

# Define the module files to process
modules = [
    "video-prehled.html",
    "karticky.html",
    "quiz.html",
    "infografika.html",
    "prezentace.html"
]

base_path = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules"

# Define replacement patterns
replacements = [
    # Margin bottom 1.5rem
    (r'style="margin-bottom: 1\.5rem;"', 'class="mb-1-5"'),
    # Margin top variations
    (r'style="margin-top: 0\.5rem;"', 'class="mt-0-5"'),
    (r'style="margin-top: 1rem;"', 'class="mt-1"'),
    (r'style="margin-top: 1\.5rem;"', 'class="mt-1-5"'),
    (r'style="margin-top: 2rem;"', 'class="mt-2"'),
    # List variations
    (r'style="line-height: 1\.8; padding-left: 1\.5rem;"', 'class="list-padded-spaced"'),
    (r'style="padding-left: 1\.5rem; line-height: 1\.8;"', 'class="list-padded-spaced"'),
    (r'style="padding-left: 1\.5rem; margin-top: 0\.5rem;"', 'class="list-with-margin"'),
    (r'style="line-height: 1\.8;"', 'class="list-spaced"'),
    (r'style="padding-left: 1\.5rem;"', 'class="list-padded"'),
    # CTA Gradient Box - multi-line pattern
    (
        r'<div class="tip-box"\s*\n\s*style="margin-top: 2rem; background: linear-gradient\(135deg, #667eea 0%, #764ba2 100%\); color: white;">',
        '<div class="cta-gradient-box">'
    ),
    # CTA Gradient Link - multi-line pattern  
    (
        r'<a href="([^"]+)"\s*\n\s*style="display: inline-block; margin-top: 1rem; padding: 0\.75rem 1\.5rem; background: white; color: #667eea; text-decoration: none; border-radius: 8px; font-weight: 600; transition: transform 0\.2s;">',
        r'<a href="\1" class="cta-gradient-link">'
    ),
    # Footer text
    (r'style="margin-top: 0\.5rem; font-size: 0\.9rem;"', 'class="footer-text"'),
    (r'style="color: var\(--primary-blue\); text-decoration: none;"', 'class="link-primary"'),
]

def process_file(filepath):
    """Process a single HTML file and replace inline styles with CSS classes."""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Apply all replacements
    for pattern, replacement in replacements:
        content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
    
    # Check if any changes were made
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"  ✓ Updated {filepath}")
        return True
    else:
        print(f"  - No changes needed for {filepath}")
        return False

def main():
    """Process all module files."""
    total_updated = 0
    
    for module in modules:
        filepath = os.path.join(base_path, module)
        if os.path.exists(filepath):
            if process_file(filepath):
                total_updated += 1
        else:
            print(f"  ✗ File not found: {filepath}")
    
    print(f"\n✅ Complete! Updated {total_updated}/{len(modules)} files.")

if __name__ == "__main__":
    main()
