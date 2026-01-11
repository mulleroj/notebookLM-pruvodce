import os
import re

# Mapování náhrad ikon
ICON_REPLACEMENTS = {
    # Hlavní menu
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Domů</span>': 
        'sidebar-icon">🏠</span>\r\n                        <span class="sidebar-text">Domů</span>',
    
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Jak začít</span>':
        'sidebar-icon">🚀</span>\r\n                        <span class="sidebar-text">Jak začít</span>',
    
    # Studio Moduly
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Studio Moduly</span>':
        'sidebar-icon">🎬</span>\r\n                        <span class="sidebar-text">Studio Moduly</span>',
    
    # Moduly - submenu
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Audio přehled</span>':
        'sidebar-icon">🎧</span>\r\n                                <span class="sidebar-text">Audio přehled</span>',
    
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Video přehled</span>':
        'sidebar-icon">🎥</span>\r\n                                <span class="sidebar-text">Video přehled</span>',
    
    'sidebar-icon">???</span>\r\n                                <span class="sidebar-text">Myšlenková mapa</span>':
        'sidebar-icon">🗺️</span>\r\n                                <span class="sidebar-text">Myšlenková mapa</span>',
    
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Zprávy</span>':
        'sidebar-icon">📝</span>\r\n                                <span class="sidebar-text">Zprávy</span>',
    
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Výukové kartičky</span>':
        'sidebar-icon">🃏</span>\r\n                                <span class="sidebar-text">Výukové kartičky</span>',
    
    'sidebar-icon">?</span>\r\n                                <span class="sidebar-text">Kvíz</span>':
        'sidebar-icon">❓</span>\r\n                                <span class="sidebar-text">Kvíz</span>',
    
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Infografika</span>':
        'sidebar-icon">🎨</span>\r\n                                <span class="sidebar-text">Infografika</span>',
    
    'sidebar-icon">???</span>\r\n                                <span class="sidebar-text">Prezentace</span>':
        'sidebar-icon">📽️</span>\r\n                                <span class="sidebar-text">Prezentace</span>',
    
    'sidebar-icon">??</span>\r\n                                <span class="sidebar-text">Tabulka dat</span>':
        'sidebar-icon">📋</span>\r\n                                <span class="sidebar-text">Tabulka dat</span>',
    
    # Obsah sekce
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Use Cases</span>':
        'sidebar-icon">💡</span>\r\n                        <span class="sidebar-text">Use Cases</span>',
    
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Troubleshooting</span>':
        'sidebar-icon">🔧</span>\r\n                        <span class="sidebar-text">Troubleshooting</span>',
    
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">SPU & ADHD</span>':
        'sidebar-icon">🧠</span>\r\n                        <span class="sidebar-text">SPU & ADHD</span>',
    
    'sidebar-icon">??</span>\r\n                        <span class="sidebar-text">Co je nového</span>':
        'sidebar-icon">📰</span>\r\n                        <span class="sidebar-text">Co je nového</span>',
    
    # Navigační odkazy - různé varianty
    'nav-link">?? Styly</a>': 'nav-link">🎨 Styly</a>',
    'nav-link">?? Prompty</a>': 'nav-link">🎯 Prompty</a>',
    'nav-link">?? Příklady</a>': 'nav-link">💼 Příklady</a>',
}

def fix_icons_in_file(file_path):
    """Opraví poškozené ikony v jednom souboru."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        replacements_made = 0
        
        # Proveď všechny náhrady
        for old, new in ICON_REPLACEMENTS.items():
            if old in content:
                content = content.replace(old, new)
                count = original_content.count(old)
                replacements_made += count
                print(f"  - Opraveno {count}x: {old[:50]}...")
        
        # Zapiš zpět pouze pokud byly provedeny změny
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ {os.path.basename(file_path)}: Provedeno {replacements_made} oprav")
            return True
        else:
            print(f"- {os.path.basename(file_path)}: Žádné změny")
            return False
            
    except Exception as e:
        print(f"✗ Chyba při zpracování {file_path}: {e}")
        return False

def main():
    modules_dir = r"c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules"
    
    if not os.path.exists(modules_dir):
        print(f"Adresář neexistuje: {modules_dir}")
        return
    
    print("Začínám opravu poškozených ikon...")
    print("=" * 60)
    
    html_files = [f for f in os.listdir(modules_dir) if f.endswith('.html')]
    total_fixed = 0
    
    for filename in sorted(html_files):
        file_path = os.path.join(modules_dir, filename)
        if fix_icons_in_file(file_path):
            total_fixed += 1
    
    print("=" * 60)
    print(f"\nHotovo! Opraveno {total_fixed} souborů z {len(html_files)} HTML souborů.")

if __name__ == "__main__":
    main()
