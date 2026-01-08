# PowerShell script to replace emoji icons with PNG icons in module HTML files
# Only processes files in the modules directory

$moduleFiles = Get-ChildItem -Path "c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema\modules" -Filter "*.html"

# Define replacements for module files (using relative paths ../)
$moduleReplacements = @{
    '<span class="sidebar-icon">🏠</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/home.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🚀</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/rocket.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🎬</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/categories/studio.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🎧</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/audio.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🎥</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/video.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🧠</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/myslenkova-mapa.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">📝</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/messages.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🃏</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/flashcards.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">❓</span>'   = '<span class="sidebar-icon"><img src="../assets/icons/modules/quiz.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🎨</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/infografika.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">📽️</span>' = '<span class="sidebar-icon"><img src="../assets/icons/modules/prezentace.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">📋</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/modules/tabulka-dat.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">💡</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/use-cases.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">🔧</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/troubleshooting.png" class="icon" alt=""></span>'
    '<span class="sidebar-icon">📰</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/news.png" class="icon" alt=""></span>'
}

$fileCount = 0
$changeCount = 0

foreach ($file in $moduleFiles) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($emoji in $moduleReplacements.Keys) {
        if ($content -match [regex]::Escape($emoji)) {
            $content = $content.Replace($emoji, $moduleReplacements[$emoji])
            $modified = $true
            $changeCount++
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
        $fileCount++
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "`nCompleted! Modified $fileCount files with $changeCount changes."
