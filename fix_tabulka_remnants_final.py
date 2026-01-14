
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

replacements = [
    # Headers
    (b'?? Kritick\xc3\xa1 pravidla', b'\xe2\x9b\x94 Kritick\xc3\xa1 pravidla'), # ⛔ or 🛑

    # Card Contents (Zlatý řez)
    (b'?? Kotva', b'\xe2\x9a\x93\xef\xb8\x8f Kotva'), # ⚓
    (b'?? Co si m\xc3\xa1 \xc5\xbe\xc3\xa1k', b'\xf0\x9f\xa7\xa0 Co si m\xc3\xa1 \xc5\xbe\xc3\xa1k'), # 🧠
    (b'?? Text pro infografiku', b'\xf0\x9f\x93\x9d Text pro infografiku'), # 📝
    (b'?? Kdy a pro\xc4\x8d', b'\xe2\x9d\x93 Kdy a pro\xc4\x8d'), # ❓
    (b'?? V\xc3\xbdklad', b'\xf0\x9f\x97\xa3\xef\xb8\x8f V\xc3\xbdklad'), # 🗣️
    (b'?? Jak to vypad\xc3\xa1', b'\xf0\x9f\x91\x80 Jak to vypad\xc3\xa1'), # 👀
    (b'?? Cvi\xc4\x8den\xc3\xad', b'\xe2\x9c\x8d\xef\xb8\x8f Cvi\xc4\x8den\xc3\xad'), # ✍️
    (b'?? Kde \xc5\xbe\xc3\xa1ci padaj\xc3\xad', b'\xf0\x9f\xa4\x95 Kde \xc5\xbe\xc3\xa1ci padaj\xc3\xad'), # 🤕 (Bandage) or ⚠️
    (b'?? Z\xc3\xa1klad pro testov\xc3\xa9', b'\xf0\x9f\x8f\x97\xef\xb8\x8f Z\xc3\xa1klad pro testov\xc3\xa9'), # 🏗️
    (b'?? Co p\xc5\x99esn\xc4\x9b lze zkontrolovat', b'\xe2\x9c\x85 Co p\xc5\x99esn\xc4\x9b lze zkontrolovat'), # ✅
    (b'?? Testy bez vym\xc3\xbd\xc5\xa1len\xc3\xad', b'\xf0\x9f\x9a\x80 Testy bez vym\xc3\xbd\xc5\xa1len\xc3\xad'), # 🚀
    (b'?? Pro u\xc4\x8ditele', b'\xf0\x9f\x8d\x8e Pro u\xc4\x8ditele'), # 🍎
    (b'?? Metodika', b'\xf0\x9f\x93\x98 Metodika'), # 📘
    
    # List items with single ?
    (b'<li>? ', b'<li>\xe2\x9d\x8c '), # ❌
]

new_content = content
for bad, good in replacements:
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed final remnants in tabulka-dat.html")
else:
    print("No changes made.")
