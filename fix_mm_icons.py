
import os

path = r'c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\myslenkova-mapa.html'

with open(path, 'rb') as f:
    content = f.read()

# Replacements (Literal '??' to Icons)
# 1. Bullets in "Ideální situace" list (check marks? or bullets?)
# <li>?? <strong>...
# Context: <li>?? <strong>
# Replace with: <li>✅ <strong> (Check mark seems appropriate here based on context)
# Or maybe just a bullet point •? Or a specific icon.
# The user screenshot shows them as a list.
# Let's use ✅ because it's "Ideal situations".

# 2. "?? Nejlepší pro"
# <h4>?? Nejlepší pro</h4>
# Replace with: <h4>🏆 Nejlepší pro</h4> (Trophy or Star)

# 3. "?? Praktický příklady"
# <div class="example-title">?? Praktický příklady použití</div>
# Replace with: <div class="example-title">📝 Praktický příklady použití</div> 
# (Or maybe 💡?)

# 4. Footer "Myšlenková mapa ??"
# Replace with "Myšlenková mapa 🗺️"

replacements = {
    b'<li>?? <strong>': b'<li>\xe2\x9c\x85 <strong>', # ✅
    b'<h4>?? Nejlep': b'<h4>\xf0\x9f\x8f\x86 Nejlep', # 🏆
    b'">?? Praktick': b'">\xf0\x9f\x93\x9d Praktick', # 📝
    b'lenkov\xc3\xa1 mapa ??': b'lenkov\xc3\xa1 mapa \xf0\x9f\x97\xba\xef\xb8\x8f', # 🗺️
}

new_content = content
for bad, good in replacements.items():
    new_content = new_content.replace(bad, good)

if new_content != content:
    with open(path, 'wb') as f:
        f.write(new_content)
    print("Fixed myslenkova-mapa.html")
else:
    print("No changes made. Patterns might not match.")
