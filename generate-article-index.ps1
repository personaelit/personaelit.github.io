
$articles = Get-ChildItem -Path "articles" -Directory
$links = "";
foreach($article in $articles) {
    $name = $article.Name.Replace("-", " ");
    $links += "`t`t`t<li><a href=""$article"">$name</a></li>`r`n";
}

$template = Get-Content .\articles\index.template
$template = $template.Replace("[[LINKS]]", $links);
Set-Content -Path .\articles\index.html -Value $template;

# A slicker implementation may be to traverse the html file as XML and replace the nodes that way.
# $foo = ([xml]$file).html.body.main.ul.ChildNodes
