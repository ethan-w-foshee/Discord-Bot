import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { editOriginalInteractionResponse,
	 sendInteractionResponse,
	 InteractionResponseTypes } from "../../deps.js";

function pong(bot, interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: InteractionResponseTypes.DeferredChannelMessageWithSource
    });
    editOriginalInteractionResponse(bot,
		interaction.token,
		{
		    content:"Pong!"
		});
}

addBotCommand(bot, {
    type: "slash",
    name: "ping",
    description: "Poke the bot, just a bit",
    actions: [
	pong
    ]
});
