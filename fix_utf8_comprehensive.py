#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Comprehensive fix for all UTF-8 encoding issues in the HTML file
"""

# Read the file as binary
with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'rb') as f:
    content = f.read()

print(f"Original file size: {len(content)} bytes")

# Try to decode with error handling
try:
    # Decode with 'replace' to find problematic bytes
    decoded = content.decode('utf-8', errors='replace')
    
    # Count replacement characters
    replacement_count = decoded.count('\ufffd')
    print(f"Found {replacement_count} invalid UTF-8 sequences (marked with �)")
    
    # Now decode with 'ignore' to remove invalid bytes
    decoded_clean = content.decode('utf-8', errors='ignore')
    
    # Re-encode as clean UTF-8
    content_clean = decoded_clean.encode('utf-8')
    
    print(f"Cleaned file size: {len(content_clean)} bytes")
    print(f"Removed {len(content) - len(content_clean)} bytes")
    
    # Write back
    with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'wb') as f:
        f.write(content_clean)
    
    print("✅ File cleaned and saved!")
    
    # Verify
    with open(r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html', 'rb') as f:
        verify = f.read()
        try:
            verify.decode('utf-8')
            print("✅ Verification: File is now valid UTF-8!")
        except UnicodeDecodeError as e:
            print(f"❌ Still has encoding issues: {e}")
            
except Exception as e:
    print(f"ERROR: {e}")
