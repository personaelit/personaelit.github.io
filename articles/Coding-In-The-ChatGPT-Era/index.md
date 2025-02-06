--- 
title: "Coding in the ChatGPT Era"
author: "James Smits"
description: "Just my thoughts on the coding landscape in the ChatGPT era."
heading: "Coding in the Era of ChatGPT"
header-image-alt-text: "A highly stylized cyborg representation of two AI assistants looking at each other."
subtitle: "the djinn has left the bottle"

---

Confessions of a mediocre coder, in short, if you're not using it, you're not adapting to the post AI world.

For example, the cover image of this post was generated using Midjourney.

However, this article is written by a human, pinky swear

But I could just ask an AI to do it.

And as you're probably at least subconsciously aware, the results would be passable if not a little bland.

Anyway, I promised something about coding in the title.

So here it is:

AI is going to be a part of your coding life. If it isn't already.
 
And if you're not using it, you're not adapting to the post AI world.

Just now as I wrote this in VS code, Copilot suggested the last two paragraphs, and I simply hit tab to fill in the content.

So about that pinky swear, I guess I lied.

## Adapt

Seriously though, I have major reservations about AI.  Its <a href="https://www.unep.org/news-and-stories/story/ai-has-environmental-problem-heres-what-world-can-do-about">environmental impact</a> is significant. As are concerns about the <a href="https://hbr.org/2023/04/generative-ai-has-an-intellectual-property-problem">IP rights that were trampled</a> to train the models. <a href="https://www.ibm.com/think/topics/ai-hallucinations">It's output is questionable.</a> However, in spite of all of it's downsides, AI is <i>useful.</i>

<aside>

Copilot suggested this (somewhat) factually incorrect line with made up links:

<p class="strike-through">For example, I used <a href="https://www.npmjs.com/package/midjourney">Midjourney</a> to generate the cover image for this article.  I used <a href="https://www.npmjs.com/package/gpt-3.5">GPT-3.5</a> to generate the first paragraph.  And I used <a href="https://www.npmjs.com/package/copilot">Copilot</a> to generate the last two paragraphs.</p>
</aside>

## E.g.

Now for some code. This is a function I wrote that cycles through colors before I started using AI. (A little embarrassing as it is verbose and procedural and I didn't know about <code>requestAnimationFrame</code> which I should have used instead of <code>setInterval</code>.)

<pre><code class="language-javascript">
window.addEventListener('DOMContentLoaded', (event) => {
	let orb = document.getElementById("orb");
	let orbBackground = document.getElementById("orbBackground");
	
	let red = Math.floor(Math.random() * 255);
	let green = Math.floor(Math.random() * 255);
	let blue = Math.floor(Math.random() * 255);
	
	let redAscending = true;
	let blueAscending = true;
	let greenAscending = true;
	
	setInterval(() => {
	if (redAscending && red < 255) {
		red++;
	}
	else if (red >= 0) {
		if (red == 0) {
			redAscending = true;
		}
		else {
			redAscending = false;
			red--;
		}
	}
	}, Math.round(Math.random() * (100 - 10)) + 10);
	
	setInterval(() => {
	if (blueAscending && blue < 255) {
		blue++;
	}
	else if (blue >= 0) {
		if (blue == 0) {
			blueAscending = true;
		}
		else {
			blueAscending = false;
			blue--;
		}
	}
	}, Math.round(Math.random() * (100 - 10)) + 10);
	
	setInterval(() => {
	if (greenAscending && green < 255) {
		green++;
	}
	else if (green >= 0) {
		if (green == 0) {
			greenAscending = true;
		}
		else {
			greenAscending = false;
			green--;
		}
	}
	}, Math.round(Math.random() * (100 - 10)) + 10);
	
	setInterval(() => {
	
	orb.style.boxShadow = `inset 0px 0px 80px 40px rgb(${red},${green},${blue})`
	orb.style.border = `1px solid rgb(${red},${green},${blue})`
	orbBackground.style.boxShadow = `0px 0px 80px 40px rgb(${red},${green},${blue})`
	orbBackground.style.border = `1px solid rgb(${red},${green},${blue})`
	}, 10)
});
</code></pre>

Here is ChatGPT's implementation (to be fair, I had to coax it, and used my code as a seed.)

<pre><code class="language-javascript">
window.addEventListener('DOMContentLoaded', () => {
	let orb = document.getElementById("orb");
	let orbBackground = document.getElementById("orbBackground");
	let hue = Math.floor(Math.random() * 360); // Start with a random hue
	let hueSpeed = 1; // Speed of hue transition
	
	function animate() {
		hue = (hue + hueSpeed) % 360; // Increment hue and wrap around at 360
		let color = `hsl(${hue}, 100%, 50%)`; // Full saturation, 50% lightness
		orb.style.boxShadow = `inset 0px 0px 80px 40px ${color}`;
		orb.style.border = `1px solid ${color}`;
		orbBackground.style.boxShadow = `0px 0px 80px 40px ${color}`;
		orbBackground.style.border = `1px solid ${color}`;
		requestAnimationFrame(animate);
	}
	animate();
});
</code>
</pre>

Much more succinct, and documented with comments (your opinions about code comments notwithstanding.) 

And here is a snippet from another project that changes the text color based on the background color. I was very proud of this when I wrote it because I had to figure the math out on my own. The point being, it doesn't look like much, but it took thought.
<pre><code class="language-javascript">
if (rgb[0] + rgb[1] + rgb[2] > 255 * 3 / 2) {
	document.body.style.color = `rgb(${0},${0},${0})`
}
else {
	document.body.style.color = `rgb(${255},${255},${255})`
}
</code></pre>

I described the same problem to ChatGPT using natural language and got this:

<pre><code class="language-javascript">
function adjustTextColor() {
	// Get the computed background color	
	let bgColor = window.getComputedStyle(document.body).backgroundColor;	
	
	// Extract RGB values	
	let rgb = bgColor.match(/\d+/g).map(Number);	
	
	if (rgb.length < 3) return; // Ensure valid RGB values	
	
	// Calculate luminance using the standard formula	
	let luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;	
	
	// Set text color based on luminance threshold	
	document.body.style.color = luminance > 0.5 ? "black" : "white";	
}	
// Run function on page load	
adjustTextColor();
</code></pre>

It's a little more verbose, but it's also more robust.  It's also more readable, and it's documented with comments. But more importantly, it used the standard formula for luminance - something that took me a while to do on my own (and I did it a different way).

## Conclusion

So, in conclusion, AI is going to be a part of your coding life. If it isn't already. And if you're not using it, you're not adapting to the post AI world. And I only spoke to its usefulness, not its speed, which is another upside of AI.

The previous paragraph was provided by Copilot. (or was it.)