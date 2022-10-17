import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";

import rolling from "./src/roll.js"
import createQuote from "./src/quote.js"

function ackInteraction(interaction) {
    discordeno.sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: discordeno.InteractionResponseTypes.DeferredChannelMessageWithSource,
    });
}

export const bot = discordeno.createBot({
    intents: discordeno.Intents.Guilds | discordeno.Intents.GuildMessages | discordeno.Intents.MessageContent,
    token: Deno.env.get("DISCORD_TOKEN"),
    events: {
	ready() {
	    console.log("Successfully connected to gateway");
	},
	messageCreate(bot, msg) {
	    rolling(bot, msg)
	    if (msg.content == "###ping") {
		discordeno.sendMessage(bot, msg.channelId, {
		    content: "pong"
		});
	    }
	},
	interactionCreate(bot, interaction) {
	    let command = interaction.data.name
	    switch (command) {
	    case 'quote-message':
		// Ack the command
		ackInteraction(interaction);
		
		let messageObject = interaction.data.resolved.messages.values().next().value; // Need to use an iterator to get content, just do "next" once to get the first element

		// getMember returns a Promise, to getAuthor is a Promise
		let getAuthor = discordeno.getMember(bot, interaction.guildId, messageObject.authorId);

		// Once the author is retrieved, continue with things
		getAuthor.then((authorObject) => {
		    // Use nickname with real username as a fallback
		    let authorName = authorObject.nick ? authorObject.nick : authorObject.user.username;
		    let quoteContent = messageObject.content;

		    // Create quote, THEN edit the original ack with the image
		    createQuote(authorName, quoteContent)
			.then((image) => discordeno.editOriginalInteractionResponse(
			    bot,
			    interaction.token,
			    {
				content: image
			    }
			));

		});
		break;
	    case 'quote':
		// Ack the command
		ackInteraction(interaction);

		// This needs to be a promise so that we can resolve the user's name if it's an @ THEN run the createQuote function
		let getAuthorName = new Promise(function(resolve) {
		    let inval = interaction.data.options[0].value; // raw input
		    let result = inval;
		    if (inval.match(/<@.*>/)) { // If it's an @
			let userId = inval.slice(2, inval.length - 1); // Remove encapsulation, just get Id
			result = discordeno.getMember(bot, interaction.guildId, userId)
			    .then((userObject) => userObject.nick ? userObject.nick : userObject.user.username);
		    }
		    resolve(result);
		})
		let quoteContent = interaction.data.options[1].value; // Just take this

		// Once authorName is resolved, continue
		getAuthorName.then((authorName) => {
		    // Create quote, THEN edit the original ack with the image
		    createQuote(authorName, quoteContent)
			.then((image) => discordeno.editOriginalInteractionResponse(
			    bot,
			    interaction.token,
			    {content: image}
			));
		});
		
		break;
	    }
	    //console.log(interaction.data);
	}
    }
});

// Add an array to allow other modules to add commands
bot.commands = []
