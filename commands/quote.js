// Create an inspriational quote either based on a slash command or somebody else's message
// This uses a public(?) API that I "reverse engineered" from quozio.com

import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";
import { bot } from "../bot.js";

// Add the commands to the bot
bot.commands.push(
    // Slash command
    {
	description: "Create a very inspirational quote",
	name: "quote",
	options: [{
	    name: "author",
	    description: "who originally said the quote",
	    type: discordeno.ApplicationCommandOptionTypes.String,
	    required: true,
	},{
	    name: "quote",
	    description: "the quote text",
	    type: discordeno.ApplicationCommandOptionTypes.String,
	    required: true
	}],
	type: discordeno.ApplicationCommandTypes.ChatInput
    },
    // Message command
    {
	description: "Turn a message into an inspriational quote",
	name: "quote-message",
	options: [{
	    name: "author",
	    description: "who originally said the quote",
	    type: discordeno.ApplicationCommandOptionTypes.String,
	    required: true,
	},{
	    name: "quote",
	    description: "the quote text",
	    type: discordeno.ApplicationCommandOptionTypes.String,
	    required: true
	}],
	type: discordeno.ApplicationCommandTypes.Message
    }
);

export default async function createQuote(author, message) {
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

    let quoteId = quote['quoteId'];

    // Choose a random template
    path = 'api/v1/templates';
    var templates = await fetch(host + path)
	.then((response) => response.json())
	.then((body) => body['data']);

    let index = Math.floor(Math.random() * templates.length);
    let templateId = templates[index]['templateId'];

    // Apply the template to the quote
    path = `api/v1/quotes/${quoteId}?templateId=${templateId}`
    var imageUrls = await fetch(host + path)
	.then((response) => response.json())
	.then((body) => body['imageUrls']);

    let imageUrl = imageUrls['medium'];

    // Return generated image
    return imageUrl;
}

