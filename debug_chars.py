
path = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\video-prompty.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Find "pĹ™"
index = content.find("pĹ™")
if index != -1:
    snippet = content[index:index+5]
    print(f"Found snippet: {snippet}")
    for char in snippet:
        print(f"Char: {char}  Hex: {hex(ord(char))}  Name: {char.encode('unicode_escape')}")
else:
    print("Sequence 'pĹ™' not found using simple string find.")
    # Try finding "p" followed by something looking like it
    p_indices = [i for i, c in enumerate(content) if c == 'p' and content[i+1:i+10].find('hlev') != -1] # "p...hled"
    # Actually just look for "Video " context
    idx = content.find("Video ")
    if idx != -1:
        print("Context around 'Video ':")
        snippet = content[idx:idx+20]
        print(snippet)
        for char in snippet:
            print(f"Char: {char}  Hex: {hex(ord(char))}")

path2 = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html"
with open(path2, 'r', encoding='utf-8') as f:
    c2 = f.read()
    
idx2 = c2.find("Toggle menu")
if idx2 != -1:
    snippet = c2[idx2+13:idx2+20]
    print(f"Infografika snippet: {snippet}")
    for char in snippet:
        print(f"Char: {char}  Hex: {hex(ord(char))}")
