# -*- coding: utf-8 -*-

file_path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-prompty.html'

with open(file_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Check specific lines
print("Line 1198:")
print(repr(lines[1197]))
print()

print("Lines 1209-1210:")
print(repr(lines[1208]))
print(repr(lines[1209]))
print()

print("Line 1230:")
print(repr(lines[1229]))
print()

print("Lines 1236-1237:")
print(repr(lines[1235]))
print(repr(lines[1236]))
print()

print("Line 1240:")
print(repr(lines[1239]))
