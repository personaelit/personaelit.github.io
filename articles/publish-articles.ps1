# Import the MarkdownPS module
Import-Module MarkdownPS
Import-Module PowerShell-Yaml

# Get all subdirectories in the articles directory
$subdirectories = Get-ChildItem -Directory

foreach ($subdir in $subdirectories) {
    # Define the paths to the template and markdown files
    $templatePath = Join-Path -Path $subdir.Parent.FullName -ChildPath "index.template"
    $markdownPath = Join-Path -Path $subdir.FullName -ChildPath "index.md"
    $outputPath = Join-Path -Path $subdir.FullName -ChildPath "index.html"

    # Check if both files exist
    if ((Test-Path $templatePath) -and (Test-Path $markdownPath)) {
        # Read the content of the template and markdown files
        $templateContent = Get-Content -Path $templatePath -Raw
        $markdownContent = Get-Content -Path $markdownPath -Raw

        # Extract front matter
        if ($markdownContent -match "(?s)^---\s*\r?\n(.*?)(?=\r?\n---\s*\r?\n)") {
            $frontMatter = $matches[1] -replace "`r`n", "`n"
        } else {
            $frontMatter = ""
        }
        # Convert the front matter to a hashtable
        $frontMatterHash = ConvertFrom-Yaml -Yaml $frontMatter

        # Remove the front matter from the markdown content
        $markdownContent = $markdownContent -replace "(?s)^---\s*\r?\n.*?\r?\n---\s*\r?\n", ""

        # Convert the markdown content to HTML
        $htmlContent = (ConvertFrom-Markdown -InputObject $markdownContent).Html


        # Replace placeholders in the template with front matter and HTML content
        $outputContent = $templateContent -replace "{{content}}", $htmlContent

        foreach ($key in $frontMatterHash.Keys) {
            $outputContent = $outputContent.Replace("{{" + $key + "}}", $frontMatterHash[$key])
        }

        $outputContent = $outputContent -replace "{{.*?}}", ""

        # Write the output content to the index.html file
        Set-Content -Path $outputPath -Value $outputContent

        Write-Output "Published $outputPath"
    } else {
        Write-Output "Skipping $subdir.FullName: index.template or index.md not found"
    }
}