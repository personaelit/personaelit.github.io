# Define the path to the HTML template file
$templatePath = "article-list.template"

# Define the output path for the final HTML file
$outputPath = "index.html"

# Read the HTML template
$templateContent = Get-Content -Path $templatePath -Raw

# Initialize an empty array to hold the links
$links = @()

# Loop through each .txt file in the directory
# Loop through each directory and check for index.html file
# Sort directories by creation date, newest first
Get-ChildItem -Directory | Sort-Object CreationTime -Descending | Where-Object { Test-Path "$($_.FullName)\index.html" } | ForEach-Object {
    $dirName = $_.Name.Replace("-", " ")
    $link = "<li><a href=""$dirName"">$dirName</a></li>"
    $links += $link
}

# Join the links array into a single string with list items
$linksHtml = "<ul>" + ($links -join "") + "</ul>"

# Replace the [[LINKS]] placeholder with the generated links
$templateContent = $templateContent -replace "\[\[LINKS\]\]", $linksHtml

# Write the final HTML content to the output file
Set-Content -Path $outputPath -Value $templateContent

Write-Output "HTML file has been generated: $outputPath"
