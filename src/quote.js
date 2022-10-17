// Create an inspriational quote either based on a slash command or somebody else's message
// This uses a public(?) API that I "reverse engineered" from quozio.com


import { Html5Entities } from "https://deno.land/x/html_entities@v1.0/mod.js"

export default async function createQuote(author, message) {

    // author = Html5Entities.encode(author);
    // message = Html5Entities.encode(message);
    
    const host = 'https://quozio.com/';
    let path = '';

    // Submit quote
    path = 'api/v1/quotes';
    const body = `{
	"author": "${author}",
	"quote": "${message}"
    }`;
    
    var quote = await fetch(host + path, {
	method: "POST",
	headers: {
	    "Content-Type": "application/json",
	},
	body
    })
	.then((response) => response.json());

    console.log("Created quote at: "+quote['url']);
    let quoteId = quote['quoteId'];

    // Choose a random template
    path = 'api/v1/templates';
    var templates = await fetch(host + path)
	.then((response) => response.json())
	.then((body) => body['data']);

    let index = Math.floor(Math.random() * templates.length);
    console.log("Chose template from: "+templates[index]['url']);
    let templateId = templates[index]['templateId'];

    // Apply the template to the quote
    path = `api/v1/quotes/${quoteId}?templateId=${templateId}`
    var imageUrls = await fetch(host + path)
	.then((response) => response.json())
	.then((body) => body['imageUrls']);

    let imageUrl = imageUrls['medium'];
    console.log("Created quote image at: "+imageUrl);

    // Return generated image
    return imageUrl;
}

