--- 
title: "Some Notes About this Website"
author: "James Smits"
description: "A few notes about the making of this website."
heading: "Some notes about this website."
header-image-alt-text: "A man working in front of two monitors displaying code with a pink haze over the whole image."
subtitle: "How the sausage is made."
publish-date: "2025-02-05"

---

This website (<a href="https://personaelit.com">personaelit.com</a>) is a static site, built with HTML, CSS, and JavaScript. It is hosted on GitHub Pages.

Below are a couple of the techniques I used to exercise my creativity.

## Links

For the links, I did a few things. I wanted them to look like little slips of paper, so I styled them as follows.

<pre><code class="language-css">
a:not(.article a) {
	display: inline-block;
	background: #f0eeee;
	padding: 3px 15px;
	box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
	text-decoration: none;
	color: #333;
	font-family: 'Arial', sans-serif;
	font-size: 16px;
	transition: background-color 0.3s, box-shadow 0.3s, transform 0.1s;
}

a:hover:not(.article a) {
	background: #f9f9f9 !important;
	box-shadow: 3px 3px 7px rgba(0, 0, 0, 0.3) !important;
	transform:scale(1.2) !important;
}
</code>
</pre>

A couple of things to note about the code above. First, the pseudo class <code>(:not)</code>, is used to prevent the styling from being applied to article pages (such as the one you are reading now). Second, the <code>!important</code> flags are used to force the browser to use the rule instead of subsequent rules that would otherwise override the rule. Keen readers will know that usage of the <code>!important</code> flag is generally considered to be poor form, but hey, rules are meant to be broken. (The reason I needed to use the <code>!important</code> flag is related to the next code snippet.)

<pre><code class="language-javascript">
function stylizeLinks() {
	console.log("anchors away.")
	const anchors = document.querySelectorAll('a');
	anchors.forEach(anchor => {
	// Generate a random rotation angle between -5 and 5 degrees
	const randomAngle = Math.random() * 10 - 5;
	// Apply the rotation using a CSS transform
	anchor.style.transform = `rotate(${randomAngle}deg)`;
	anchor.classList.add('rotated');
	});
}
</code>
</pre>
I wanted the links to be displayed a little bit askew randomly which is achieved with the above code.  Setting the transform style attribute with JavaScript was overriding the transform in my stylesheet, thus the <code>!important</code> flag.

Another clever effect was to denote external links.

<pre><code class="language-javascript">
function flagExternalLinks() {
	console.log("wave that flag.")
	const links = document.querySelectorAll("a");
	// Iterate through each link
	links.forEach(link => {
	// Check if the link is external
	if (link.hostname !== window.location.hostname) {
		// Add a class to the external link
		link.classList.add("external");
	}
	});
}
</code>
</pre>

This code, coupled with the below CSS, flags external links and appends them with the 🌐 emoji.

<pre><code class="language-css">
a.external::after {
	content: " 🌐";
}
</code>
</pre>

The thing to note here is that the <code>::after</code> is pseudo-element that let's you style specific parts of an element. (In ths case add content after the element).

## Background

The background of this site is a rainbow animation where I apply chromatic shifting to the body element.  This is a completely self-indulgent design choice and it probably has negative accessibility effects. To offset the negative accessibility, I flip the color from light to dark, based on the <code>background-color</code>.

<pre><code class="language-javascript">
function startColorTransition() {
	console.log("transition init.")
	let hue = Math.floor(Math.random() * 360);
	let bgColor = `hsl(${hue}, 100%, 50%)`;
	let textColor = getTextColor(hue);
	document.body.style.setProperty('--bg-color', bgColor);
	document.body.style.setProperty('--text-color', textColor);
	setInterval(() => {
		hue = (hue + 1) % 360;
		bgColor = `hsl(${hue}, 100%, 50%)`;
		textColor = getTextColor(hue);
		document.body.style.setProperty('--bg-color', bgColor);
		document.body.style.setProperty('--text-color', textColor);
	}, 1000);
}
function getTextColor(hue) {
	// Calculate the brightness of the color and set text color accordingly
	let r, g, b;
	[r, g, b] = hslToRgb(hue / 360, 1, 0.5);
	const brightness = (r * 299 + g * 587 + b * 114) / 1000;
	return brightness > 125 ? '#000000' : '#ffffff';
}
</code>
</pre>

Key point - the CSS variables <code>--bg-color</code> and <code>--text-color</code> are used to dynamically set the hsl value via JavaScript. I declare and initialize the variables outside of the <code>setInterval</code> function so that the page loads with what appears to be a solid color.  Changing it only every second adds a bit of a softer effect than my earlier attempts with shorter intervals; which had a nauseating effect. 

## Click Effect

Another masturbatory design choice, when you click on the page anywhere, a little ripple effect is applied. This is just ornamental, but again, sometimes when you can, you do. 

<pre><code class="language-css">
	.ripple {
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgba(0, 150, 255, 0.5);
		transform: scale(0);
		animation: ripple-animation 0.2s linear;
		pointer-events: none;
		z-index: 1000;
}
</code></pre>

<pre><code class="language-javascript">
	function getRippled() {
		console.log("Ripple, on still water.")
		const rippleContainer = document.querySelector('body');
		document.addEventListener('click', (event) => {
			const ripple = document.createElement('div');
			ripple.className = 'ripple';
			// Calculate the position based on scroll offset
			const scrollX = window.scrollX || document.documentElement.scrollLeft;
			const scrollY = window.scrollY || document.documentElement.scrollTop;
			ripple.style.left = `${event.clientX - 10 + scrollX}px`;
			ripple.style.top = `${event.clientY - 10 + scrollY}px`;
			rippleContainer.appendChild(ripple);
			ripple.addEventListener('animationend', () => {
				ripple.remove();
			});
		});
	}
</code></pre>

Key point - the ripple effect is created by appending a div to the body element at the X and Y coords of the <code>click </code> event and then removing it after the animation ends. The event listener <code>animationend</code> is used to remove the div after its served its (lack of) purpose. 

## Conclusion

So these are just a few of the design choices I made, and they are very much reflective of my (chaotic) creative streak.   I also use some publishing scripts which is my homebrew take on static site generation, but that's a post for another day.