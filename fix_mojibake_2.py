
import os

files_to_fix = [
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\prezentace-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html',
    r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\audio-prompty.html'
]

# I am copying the characters EXACTLY as they appear in the view_file output
replacements = {
    'đŸ–źď¸': '🖼️',
    'PĹ™íklad': 'Příklad',
}

def fix_file(path):
    if not os.path.exists(path):
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    for bad, good in replacements.items():
        content = content.replace(bad, good)
        
    if content != original_content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Fixed {path}")

if __name__ == "__main__":
    for f in files_to_fix:
        fix_file(f)
