$content = Get-ChildItem .\content

foreach ($item in $content) {
    $pageTitle = $item.Name.Replace('.txt','');
    $pageName = "$pageTitle.html";
    $pageContent = Get-Content $item;
    $pageTemplate = Get-Content .\page.template.html;

    $pageTemplate = $pageTemplate.Replace("[[TITLE]]", $pageTitle);
    $pageTemplate = $pageTemplate.Replace("[[BODY]]", $pageContent);
    $pageTemplate = $pageTemplate.Replace("[[DATE]]", $item.CreationTime);

    Set-Content "pages/$pageName" $pageTemplate;

}


$navigation = "<ul>";
$pages = Get-ChildItem ./pages

foreach ($page in $pages) {
    $url = "pages/" + $page.Name;
    $pageName = $page.Name.Replace(".html", "");
    
    $navigation += "<li><a href='$url'>$pageName</a></li>";
}

$navigation += "</ul>"

$indexTemplate = Get-Content .\index.template.html
$indexTemplate = $indexTemplate.Replace("[[NAVIGATION]]", $navigation);
Set-Content index.html $indexTemplate;