
import os

filepath = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules\infografika-styly.html"

with open(filepath, 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    original = line
    
    # Line 204
    if "Když styl" in line and "hezkej" in line:
        # Reconstruct exactly:
        new_line = '                <p class="mt-0-5">Když styl překáží čtení → je špatně, i kdyby byl „hezkej".</p>\n'
        new_lines.append(new_line)
        print(f"Fixed Line 204: {original.strip()} -> {new_line.strip()}")
        continue

    # Line 481
    if "NEPAT" in line and "Styly" in line:
        new_line = '                Styly, které do NotebookLM infografiky NEPATŘÍ \n'
        new_lines.append(new_line)
        print(f"Fixed Line 481: {original.strip()} -> {new_line.strip()}")
        continue

    # Line 480
    if "section-icon" in line and "â" in line:
        new_line = '                <span class="section-icon">❌</span>\n'
        new_lines.append(new_line)
        print(f"Fixed Line 480: {original.strip()} -> {new_line.strip()}")
        continue
    
    # Lines 487-492 (Bullets)
    if "Fotorealistick" in line and "â" in line:
        new_line = '                    <li>❌ Fotorealistický styl</li>\n'
        new_lines.append(new_line)
        print("Fixed Bullet 1")
        continue

    if "Komiks" in line and "â" in line:
        new_line = '                    <li>❌ Komiks s dialogy</li>\n'
        new_lines.append(new_line)
        print("Fixed Bullet 2")
        continue

    if "koláže" in line and "â" in line:
        # Note: UmÄ›leckĂŠ -> Umělecké
        new_line = '                    <li>❌ Umělecké koláže</li>\n'
        new_lines.append(new_line)
        print("Fixed Bullet 3")
        continue

    if "Chaos" in line and "â" in line:
        new_line = '                    <li>❌ Chaos barev</li>\n'
        new_lines.append(new_line)
        print("Fixed Bullet 4")
        continue

    if "Dekorativní" in line and "â" in line:
        new_line = '                    <li>❌ Dekorativní písma</li>\n'
        new_lines.append(new_line)
        print("Fixed Bullet 5")
        continue

    if "PrezentaÄ" in line or "Prezentační" in line:
         if "â" in line:
            new_line = '                    <li>❌ „Prezentační show" styl</li>\n'
            new_lines.append(new_line)
            print("Fixed Bullet 6")
            continue

    new_lines.append(line)

with open(filepath, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)
