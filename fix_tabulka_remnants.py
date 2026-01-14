
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\tabulka-dat.html'

with open(path, 'rb') as f:
    content = f.read()

replacements = [
    (b'>? Varianta B', b'>\xf0\x9f\x85\xb1\xef\xb8\x8f Varianta B'), # 🅱️
    (b'>? Pro\xc4\x8d to funguje', b'>\xf0\x9f\xa7\xa0 Pro\xc4\x8d to funguje'), # 🧠 (Brain) or maybe ❓
]

# "Proč to funguje" context: "Why it works (no magic)". Brain seems appropriate or maybe ⚙️ (Gear) or ✨.
# The user prompted earlier fixes with specific icons.
# Let's use 🧠 for "Why it works" as it's about understanding.
# Or actually, the previous section "Jak to dělat" used 🛠️.
# "Proč to funguje" -> 💡 (Lightbulb) fits well too, but 💡 is used for tips.
# Let's use 🧠.

new_content = content
for bad, good in replacements:
    new_content = new_content.replace(bad, good)

# Also check for any other single `? ` in headers just in case
# <h3 class="section-header-xl">?
if b'class="section-header-xl">?' in new_content:
    print("Warning: Still found ? in section header")

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed remnants in tabulka-dat.html")
else:
    print("No changes made.")

