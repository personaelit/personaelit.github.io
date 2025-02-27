--- 
title: "What's In a Link?"
author: "James Smits"
description: "A couple of fun techniques for styling links."
heading: "Link Styling"
subtitle: "and profiling"
header-image-alt-text: "Neon pink and yellow chain links linked together in an almost M.C. Escher kind of way in front of and surrounded by leaves of pastel green and orange leaves."
publish-date: "2025-02-14"

---

In the making of this <a href="/">site</a>, the one that you are reading now, I used a couple of different techniques that I think work very well.  The first is a script that checks if the link is external and adds a class if so. The second is a similar concept - apply a style if the link does not resolve via a `HEAD` request.

<pre>
<code class="language-javascript">
function isItBorked() {
    console.log("Brokedown palace.");
    const links = document.querySelectorAll("a");

    links.forEach(link => {
        fetch(link.href, { method: 'HEAD' })
            .then(response => {
                if (response.status === 404) {
                    link.classList.add("broken-link");
                }
            })
            .catch(error => {
                console.error('Error checking link:', error);
                link.classList.add("broken-link");
            });
    });
}

</code>
</pre>

Now for the fun part: we apply some CSS styles to give a visual indication of the type of link.

<pre>
<code class="language-css">
.external, .broken-link {
    text-decoration: none;
}

.external::after {
    content: "🌐";
    margin-left: 4px;
}


.broken-link::after {
    content: "⛓️‍💥";
    margin-left: 4px;
}

a.broken-link {
    color:#d63333;
}
</code>
</pre>

The result is that this is the style for <a href="/">internal links</a>.  Just a plain jane link.

For <a href="https://example.com">external links</a> the link gets a nifty globe emoji.

And <a href="gibberish">broken links</a> get a broken chain and a red color.

To be clear, I didn't invent these ideas.  Other sites have been doing this for years (such as [WikiPedia](https://en.wikipedia.org/wiki/Main_Page)), but I think my application of these techniques turned out pretty ok I guess ;). 

One small caveat, since I am doing this all in the client - I can't check external links for 404 as it gets fouled up by CORS.
