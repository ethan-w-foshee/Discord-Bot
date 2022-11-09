import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import ackInteraction from "../util/ackInteraction.js";

function pong(_bot, interaction) {
    const now = Date.now();
    const interactionSent = Number(interaction.id / 4194304n + 1420070400000n);

    ackInteraction(interaction, "message", {ephemeral: true}, {content: `Pong! ${now - interactionSent} ms`});
    
}

addBotCommand(bot, {
    type: "slash",
    name: "ping",
    description: "Poke the bot, just a bit",
    actions: [
	pong,
    ],
});
