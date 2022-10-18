import { Intents, InteractionResponseTypes, createBot,
	 editOriginalInteractionResponse,
	 sendInteractionResponse, sendMessage } from "./deps.js";

import rolling from "./src/util/roll.js"
import { createQuote, getNameFromUser } from "./src/util/quote.js"

function ackInteraction(interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });
}

export const bot = createBot({
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    token: Deno.env.get("DISCORD_TOKEN"),
    events: {
	ready() {
	    console.log("Successfully connected to gateway");
	},
	messageCreate(bot, msg) {
	    rolling(bot, msg)
	    if (msg.content == "###ping") {
		sendMessage(bot, msg.channelId, {
		    content: "pong"
		});
	    }
	},
	interactionCreate(bot, interaction) {
	    const command = interaction.data.name
	    switch (command) {
	    case 'quote-message': {
		// Ack the command
		ackInteraction(interaction);
		
		const messageObject = interaction.data.resolved.messages.values().next().value; // Need to use an iterator to get content, just do "next" once to get the first element

		// Once the author is retrieved, continue with things
		getNameFromUser(bot, interaction.guildId, messageObject.authorId).then((authorName) => {
		    const quoteContent = messageObject.content;

		    // Create quote, THEN edit the original ack with the image
		    createQuote(authorName, quoteContent)
			.then((image) => editOriginalInteractionResponse(
			    bot,
			    interaction.token,
			    { content: image }
			));

		});
		break;
	    }
		
	    case 'quote': {
		// Ack the command
		ackInteraction(interaction);

		// Get options
		const options = interaction.data.options;

		// This needs to be a promise so that we can resolve the user's name if it's an @ THEN run the createQuote function
		const getAuthorName = new Promise(function(resolve) {
		    const inval = options.filter(option => option.name == "author")[0].value; // The value of the first match of any option entry whose "name" property is author. I.e. grab the value of the "author" parameter
		    if (inval.match(/^<@.*>$/)) { // If it's an @
			console.log("at");
			const userId = inval.slice(2, inval.length - 1); // Remove encapsulation, just get Id
			getNameFromUser(bot, interaction.guildId, userId)
			    .then((authorName) => resolve(authorName));
		    } else {
			resolve(inval);
		    }
		})
		const quoteContent = options.filter(option => option.name == "quote")[0].value;

		// Once authorName is resolved, continue
		getAuthorName.then((authorName) => {
		    // Create quote, THEN edit the original ack with the image
		    createQuote(authorName, quoteContent)
			.then((image) => editOriginalInteractionResponse(
			    bot,
			    interaction.token,
			    {content: image}
			));
		});
		
		break;
	    }
		
	    default:
		break;
	    }
	    //console.log(interaction.data);
	}
    }
});

// Add an array to allow other modules to add commands
bot.commands = []
