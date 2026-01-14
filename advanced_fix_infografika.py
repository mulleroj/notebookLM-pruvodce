# -*- coding: utf-8 -*-
import sys

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

# Read as binary
with open(file_path, 'rb') as f:
    raw_bytes = f.read()

# Try to decode as UTF-8 first
try:
    content = raw_bytes.decode('utf-8')
    print("File is already UTF-8")
    
    # Check if it has mojibake (double-encoded)
    if 'đŸ"' in content or 'Ÿ"' in content:
        print("Detected mojibake - attempting to fix...")
        # Try to reverse the damage by encoding back and decoding correctly
        try:
            # This is already broken UTF-8, we need to fix the specific characters
            fixed = content
            
            # Map of broken characters to correct ones
            fixes = {
                'đŸ" ': '🔍 ',
                'đŸ"‹': '📋',
                'đŸ–źď¸ ': '🖼️ ',
                'đŸ"š': '📚',
                'đŸ"': '🔒',
                'â ď¸': '⚠️',
                'âď¸': '✏️',
                'đž': '💾',
                'đ¤': '🖼️',
                'đĽ': '📥',
            }
            
            for broken, correct in fixes.items():
                fixed = fixed.replace(broken, correct)
            
            # Write back
            with open(file_path, 'w', encoding='utf-8', newline='\r\n') as f:
                f.write(fixed)
            
            print('✅ Fixed mojibake characters!')
            
        except Exception as e:
            print(f'Could not fix: {e}')
    else:
        print("No mojibake detected")
        
except UnicodeDecodeError:
    print("Not UTF-8, trying other encodings...")
    
    # Try common encodings
    for encoding in ['windows-1250', 'iso-8859-2', 'cp1252']:
        try:
            content = raw_bytes.decode(encoding)
            print(f"Successfully decoded as {encoding}")
            
            # Write as UTF-8
            with open(file_path, 'w', encoding='utf-8', newline='\r\n') as f:
                f.write(content)
            
            print(f'✅ Converted from {encoding} to UTF-8!')
            break
            
        except:
            continue
