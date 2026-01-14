
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\quiz.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements
# ?? Jak použít -> 🛠️ Jak použít
# ?? Typické výstupy -> 📋 Typické výstupy (Or maybe 📄?)
# ?? Zkopírovat -> 📋 Zkopírovat
# ?? Perfektní pro -> 🏆 Perfektní pro (Found in other files, likely here too)

replacements = {
    b'<h4>?? Jak pou\xc5\xbe\xc3\xad': b'<h4>\xf0\x9f\x9b\xa0\xef\xb8\x8f Jak pou\xc5\xbe\xc3\xad', # 🛠️
    b'<h4>?? Typick\xc3\xa9 v\xc3\xbd': b'<h4>\xf0\x9f\x93\x84 Typick\xc3\xa9 v\xc3\xbd', # 📄 or 📋? Let's use 📄 (Page facing up) or 📊? Lightbulb? 
    # Use 📄 F0 9F 93 84
    b'>?? Zkop\xc3\xadrovat': b'>\xf0\x9f\x93\x8b Zkop\xc3\xadrovat', # 📋
    b'<h4>?? Perfektn\xc3\xad': b'<h4>\xf0\x9f\x8f\x86 Perfektn\xc3\xad', # 🏆
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed quiz.html")
else:
    print("No changes in quiz.html")
    if b'?? Jak' in content:
        print("Still found literals")
