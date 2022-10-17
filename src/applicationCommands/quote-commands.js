import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";
import { bot } from "../../bot.js";

// Add the commands to the bot
export default bot.commands.push(
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
