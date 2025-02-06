Get-ChildItem -Recurse -Filter *.html | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content -Path $filePath -Raw
    if ($content -match '<span class="last-updated"></span>') {
        $lastUpdated = "Last Updated: $($_.LastWriteTime.ToString('dddd, yyyy/MM/dd'))"
        $updatedContent = $content -replace '<span class="last-updated"></span>', "<span class='last-updated'>$lastUpdated</span>"
        Set-Content -Path $filePath -Value $updatedContent
    }
}