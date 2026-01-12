
path = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-styly.html"
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

def print_snippet(start_text, length=30):
    idx = content.find(start_text)
    if idx != -1:
        snippet = content[idx:idx+length]
        print(f"Snippet starting with '{start_text}':")
        print(snippet)
        for char in snippet:
            print(f"Char: {char}  Hex: {hex(ord(char))}")
    else:
        print(f"'{start_text}' not found")

print_snippet("Zásada")
print_snippet("Když styl")
print_snippet("section-icon")
print_snippet("pĹ™ekáží")
