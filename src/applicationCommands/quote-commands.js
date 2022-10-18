import { ApplicationCommandOptionTypes,
	 ApplicationCommandTypes } from "../../deps.js";

import { bot } from "../../bot.js";

// Add the commands to the bot
export default bot.commands.push(
    // Slash command
    {
	description: "Create a very inspirational quote",
	name: "quote",
	options: [{
	    name: "quote",
	    description: "the quote text",
	    type: ApplicationCommandOptionTypes.String,
	    required: true
	},{
	    name: "author",
	    description: "who originally said the quote",
	    type: ApplicationCommandOptionTypes.String,
	    required: true,
	}],
	type: ApplicationCommandTypes.ChatInput
    },
    // Message command
    {
	description: "Turn a message into an inspriational quote",
	name: "quote-message",
	options: [{
	    name: "author",
	    description: "who originally said the quote",
	    type: ApplicationCommandOptionTypes.String,
	    required: true,
	},{
	    name: "quote",
	    description: "the quote text",
	    type: ApplicationCommandOptionTypes.String,
	    required: true
	}],
	type: ApplicationCommandTypes.Message
    }
);
