
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    lines = f.readlines()

found = False
for i, line in enumerate(lines):
    if b'??' in line:
        found = True
        print(f"Line {i+1}: {line.decode('utf-8', errors='replace').strip()}")

if not found:
    print("No double questions found.")
