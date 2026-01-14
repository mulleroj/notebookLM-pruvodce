
file_path = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html"

patterns = [b'\xc4\x91', b'\xc3\xa2']

with open(file_path, 'rb') as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    found = False
    for p in patterns:
        if p in line:
            found = True
            break
    if found:
        print(f"Line {i+1}: {repr(line.strip())}")
