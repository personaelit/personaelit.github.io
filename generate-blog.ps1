if (!(Test-Path 'blog')) {
    mkdir 'blog'
}

$date = Get-Date;
$year = $date.Year;
$month = $date.Month;
$day = $date.Day;


if (!(Test-Path "blog/$year/$month/$day")) {
    mkdir "blog/$year/$month/$day";
    Set-Content -Path "blog/$year/$month/$day/index.html" -Value @"
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
        <meta name="description"
            content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="../../../../personaelit.css">
        <script src="../../../../personaelit.js"></script>
    </head>
    
    <body>
        <header>
            <h1 id="title"></h1>
            <div id="subtitle"></div>
        </header>
        <time class="created-at" datetime="$date">Created at: $date</time>
        <time class="last-updated"></time>
        <main id="content">
           
        </main>
        <nav>
            <a href="/">/</a>
        </nav>
    </body>
    
    </html>
"@
}