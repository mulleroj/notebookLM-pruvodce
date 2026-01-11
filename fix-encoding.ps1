# Fix UTF-8 Encoding for Module Pages
# This script converts HTML files from Windows-1250 to UTF-8 encoding

$files = @(
    "modules\audio-prehled.html",
    "modules\video-prehled.html", 
    "modules\myslenkova-mapa.html",
    "modules\audio-prompty.html",
    "modules\video-prompty.html",
    "modules\karticky.html",
    "modules\quiz.html",
    "modules\infografika.html",
    "modules\infografika-styly.html",
    "modules\infografika-prompty.html",
    "modules\prezentace.html",
    "modules\prezentace-prompty.html",
    "modules\tabulka-dat.html"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "Converting $file to UTF-8..."
        $tempFile = "$file.tmp"
        
        # Read with Windows-1250 encoding and save as UTF-8
        $content = Get-Content $file -Encoding Default -Raw
        [System.IO.File]::WriteAllText($tempFile, $content, [System.Text.Encoding]::UTF8)
        
        # Replace original file
        Move-Item $tempFile $file -Force
        
        Write-Host "  ✓ Converted $file"
    }
    else {
        Write-Host "  ⚠ File not found: $file"
    }
}

Write-Host "`n✅ Encoding conversion complete!"
