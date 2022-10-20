import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { editOriginalInteractionResponse,
	 sendInteractionResponse,
	 InteractionResponseTypes } from "../../deps.js";

function pong(bot, interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: InteractionResponseTypes.DeferredChannelMessageWithSource
    });
    const now = Date.now();
    const interactionSent = Number(interaction.id / 4194304n + 1420070400000n);

    editOriginalInteractionResponse(bot,
		interaction.token,
		{
		    content:`Pong! ${now-interactionSent} ms`
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
