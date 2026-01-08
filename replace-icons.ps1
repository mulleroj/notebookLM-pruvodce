# PowerShell script to replace emoji icons with PNG icons in all HTML files

$files = Get-ChildItem -Path "c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema" -Filter "*.html" -Recurse

# Define replacements (emoji -> PNG img tag)
$replacements = @{
    '<span class="sidebar-icon">📚</span>'  = '<span class="sidebar-icon"><img src="../assets/icons/special/logo.png" class="icon" alt=""></span>'
    '<div class="sidebar-logo">📚</div>'    = '<div class="sidebar-logo"><img src="assets/icons/special/logo.png" class="icon" alt="NotebookLM"></div>'
    '<div class="logo-icon">📚</div>'       = '<div class="logo-icon"><img src="assets/icons/special/logo.png" class="icon" alt="NotebookLM"></div>'
    '<span class="search-icon">🔍</span>'   = '<span class="search-icon"><img src="assets/icons/special/search.png" class="icon" alt=""></span>'
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

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $modified = $false
    
    foreach ($emoji in $replacements.Keys) {
        if ($content -match [regex]::Escape($emoji)) {
            $content = $content.Replace($emoji, $replacements[$emoji])
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
