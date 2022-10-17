// Create an inspriational quote either based on a slash command or somebody else's message
// This uses a public(?) API that I "reverse engineered" from quozio.com

import { getMember } from "https://deno.land/x/discordeno@16.0.1/mod.ts";

export async function getNameFromUser(bot, guildId, userId) {
    const userObject = await getMember(bot, guildId, userId);
    return userObject.nick ? userObject.nick : userObject.user.username;
}

export async function createQuote(author, message) {

    let response;

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

    response = await fetch(host + path, {
	method: "POST",
	headers: {
	    "Content-Type": "application/json",
	},
	body
    }).then((val) => val.json());
    const quote = response;
	//.then((response) => response.json());

    console.log("Created quote at: "+quote['url']);
    const quoteId = quote['quoteId'];

    // Choose a random template
    path = 'api/v1/templates';
    response = await fetch(host + path).then((val) => val.json());
    let templates = response['data'];

    const index = Math.floor(Math.random() * templates.length);
    console.log("Chose template from: "+templates[index]['url']);
    const templateId = templates[index]['templateId'];

    // Apply the template to the quote
    path = `api/v1/quotes/${quoteId}?templateId=${templateId}`;
    response = await fetch(host + path).then((val) => val.json());
    const imageUrls = response['imageUrls'];

    const imageUrl = imageUrls['medium'];
    console.log("Created quote image at: "+imageUrl);

    // Return generated image
    return imageUrl;
}

