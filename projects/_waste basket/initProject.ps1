# Prompt for Project Name
$projectName = Read-Host "Enter the project name"

# Create Project Directory
Write-Host "Creating project directory: $projectName"
New-Item -ItemType Directory -Force -Path $projectName

# Function to create boilerplate files
function CreateBoilerplateFiles($path, $isSubDir) {
    # Determine script and style paths
    $scriptPath = if ($isSubDir) { "../script.js" } else { "script.js" }
    $stylePath = if ($isSubDir) { "../styles.css" } else { "styles.css" }

    # Create index.html with boilerplate
    $htmlContent = @"
<!DOCTYPE html>
<html>
<head>
    <title>$projectName</title>
    <link rel="stylesheet" type="text/css" href="$stylePath">
</head>
<body>
    <h1>Hello, World!</h1>
    <script src="$scriptPath"></script>
</body>
</html>
"@
    Set-Content -Path "$path\index.html" -Value $htmlContent
}

# Create boilerplate in main directory
CreateBoilerplateFiles $projectName $false

# Create script.js and styles.css in root
$jsContent = @"
document.addEventListener('DOMContentLoaded', function() {
    console.log('Script Loaded');
});
"@
Set-Content -Path "$projectName\script.js" -Value $jsContent

$cssContent = @"
body {
    font-family: Arial, sans-serif;
}
"@
Set-Content -Path "$projectName\styles.css" -Value $cssContent

# Prompt for Subdirectories
$subDirsInput = Read-Host "Enter subdirectories (comma-separated)"
$subDirs = $subDirsInput -split ',' | ForEach-Object { $_.Trim() }

# Create Subdirectories and boilerplate files
foreach ($subDir in $subDirs) {
    Write-Host "Creating subdirectory: $subDir"
    $subDirPath = "$projectName\$subDir"
    New-Item -ItemType Directory -Force -Path $subDirPath
    CreateBoilerplateFiles $subDirPath $true
}

Write-Host "Project $projectName created successfully."
