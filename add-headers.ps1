# This PowerShell script adds header element to HTML files that have sidebar but are missing header

$headerHtml = @"
    <!-- Header -->
    <header>
        <div class="header-content">
            <a href="index.html" class="logo">
                <div class="logo-icon">📚</div>
                <span>NotebookLM Průvodce</span>
            </a>
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="search" placeholder="Hledejte v průvodci...">
            </div>
        </div>
    </header>

"@

$headerHtmlModules = @"
    <!-- Header -->
    <header>
        <div class="header-content">
            <a href="../index.html" class="logo">
                <div class="logo-icon">📚</div>
                <span>NotebookLM Průvodce</span>
            </a>
            <div class="search-box">
                <span class="search-icon">🔍</span>
                <input type="text" id="search" placeholder="Hledejte v průvodci...">
            </div>
        </div>
    </header>

"@

$rootFiles = @(
    "use-cases.html",
    "troubleshooting.html",
    "spu-adhd.html",
    "novinky.html"
)

$moduleFiles = @(
    "modules/video-prehled.html",
    "modules/tabulka-dat.html",
    "modules/quiz.html",
    "modules/prezentace.html",
    "modules/myslenkova-mapa.html",
    "modules/karticky.html",
    "modules/infografika.html",
    "modules/infografika-styly.html",
    "modules/audio-prehled.html"
)

$baseDir = "c:\Users\mulle\OneDrive\Dokumenty\Antigravity_agent\Gema"

# Process root files
foreach ($file in $rootFiles) {
    $filePath = Join-Path $baseDir $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if header already exists
        if ($content -notmatch '<header>') {
            # Insert header before <!-- Sticky Navigation -->
            $content = $content -replace '(\s*<!-- Sticky Navigation -->)', "$headerHtml`$1"
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "Added header to: $file" -ForegroundColor Green
        } else {
            Write-Host "Header already exists in: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

# Process module files
foreach ($file in $moduleFiles) {
    $filePath = Join-Path $baseDir $file
    
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        
        # Check if header already exists
        if ($content -notmatch '<header>') {
            # Insert header before <!-- Sticky Navigation -->
            $content = $content -replace '(\s*<!-- Sticky Navigation -->)', "$headerHtmlModules`$1"
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "Added header to: $file" -ForegroundColor Green
        } else {
            Write-Host "Header already exists in: $file" -ForegroundColor Yellow
        }
    } else {
        Write-Host "File not found: $file" -ForegroundColor Red
    }
}

Write-Host "`nCompleted! Check the files above." -ForegroundColor Cyan
