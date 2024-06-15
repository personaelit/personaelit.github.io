# Define the path to the HTML template file
$templatePath = "index.template"

# Define the output path for the final HTML file
$outputPath = "index.html"

# Read the HTML template
$templateContent = Get-Content -Path $templatePath -Raw

# Initialize an empty array to hold the links
$links = @()

# Loop through each .txt file in the directory
Get-ChildItem -Filter *.txt | ForEach-Object {
    $fileName = $_.Name
    $createdDate = $_.CreationTime
    $lastModified = $_.LastWriteTime
    $link = "<li><a href=""$fileName"">$fileName</a> | Created: $createdDate, Last Modified: $lastModified</li>"
    $links += $link
}

# Join the links array into a single string with list items
$linksHtml = "<ul>" + ($links -join "") + "</ul>"

# Replace the [[LINKS]] placeholder with the generated links
$templateContent = $templateContent -replace "\[\[LINKS\]\]", $linksHtml

# Write the final HTML content to the output file
Set-Content -Path $outputPath -Value $templateContent

Write-Output "HTML file has been generated: $outputPath"
