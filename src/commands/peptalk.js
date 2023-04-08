import { bot } from "../../bot.js";
import {editOriginalInteractionResponse } from "../../deps.js";
import { addBotCommand } from "../lib/commands.js";
import { genPeptalk } from "../util/peptalk/genPeptalk.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Pump yourself up with a peptalk",
    name: "peptalk",
    type: "slash",
    actions: [
	async function (bot, interaction) {
	    ackInteraction(interaction)

	    const msg = await genPeptalk();

	    editOriginalInteractionResponse(
		bot,
		interaction.token,
		{ content: msg },
	    )
	}
    ]
});
