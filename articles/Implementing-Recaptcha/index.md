--- 
title: "Implementing reCAPTCHA"
author: "James Smits"
description: "My experience implementing reCAPTCHA for a contact form."
heading: "My Experience Implementing reCAPTCHA"
subtitle: "human or computer? not even sure anymore."
header-image-alt-text: "A red-headed woman in profile nose to nose with a humanoid robot."
publish-date: "2025-02-27"

---

I have a contact form that has been dormant, but recently gained more prominence, and with that prominence came... you guessed it, SPAM.

Here are the steps I went through to create a reCAPTCHA to prevent the SPAM.

I already have a reCAPTCHA account set up with Google. 

I went to https://www.google.com/recaptcha/admin/create to create the reCAPTCHA, chose v3, ad entered my domain.


<aside>
The main difference between **reCAPTCHA v2** and **reCAPTCHA v3** is how they assess and challenge user interactions:

- **reCAPTCHA v2**: Requires user interaction. It presents a checkbox ("I'm not a robot") or a challenge (like selecting images) if the interaction seems suspicious.
- **reCAPTCHA v3**: Works invisibly in the background. It assigns a **risk score (0.0 to 1.0)** based on user behavior, allowing developers to decide when to block or challenge a user.
</aside>

On the next page, I copied my keys and stored them safely.

## On to Implementation

To be frank, I find google docs ambiguous, indistinct, and generally just shoddy, but here they are anyway:

- [Client Side](https://developers.google.com/recaptcha/docs/v3)
- [Server Side](https://developers.google.com/recaptcha/docs/verify)

Thankfully, there are enough [drops in my knowledge bucket](../Your-Knowledge/) to figure out the details. 

### Client Side

The client side was easy enough. Just add a script reference to https://www.google.com/recaptcha/api.js and the following script:

<pre>
<code class="language-html">
function onSubmit(token) {
	document.getElementById("contact-form").submit();
}
</code>
</pre>

And some attributes to the button:

<pre>
<code class="language-html">
&lt;button 
	type="submit"
	class="g-recaptcha"
	data-sitekey="recaptcha-key" 
	data-callback='onSubmit'
	data-action='submit'&gt;
	Submit
&lt;/button&gt;
</code>
</pre>


### Server Side

Server side was also fairly straight forward. Just send the response along to Google with your secret key, and return true or false based on the score provided.

<pre>
<code class="language-javascript">

async function isHuman(captchaResponse) {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;

    try {
        const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                secret: secretKey,
                response: captchaResponse
            })
        });

        const data = await res.json();

        if (!data.success) {
            return false;
        }
        
        return data.score >= 0.7; // Accept only high-confidence requests
        
    } catch (error) {
        console.error('Error validating captcha:', error);
        return false;
    }
}
</code>
</pre>

Then just check the humanness in the form post.

<pre>
<code class="language-javascript">
    if (!isHuman(req.body['g-recaptcha-response']))
        return res.redirect('/?error=Captcha validation failed');
</code>
</pre>

<aside>
**reCAPTCHA v3**: Uses a score (0.0 to 1.0) instead of a challenge-response. Typically:

- Scores **≥ 0.7** are considered human.
- Scores **≤ 0.3** are likely bots.
- Scores in **0.3 - 0.7 range** might need additional verification.
</aside>

So there ya go.  My experience implementing reCAPTCHA.  Easy-breezy.










