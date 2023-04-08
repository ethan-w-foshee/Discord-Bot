import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { genPeptalk } from "../util/peptalk/genPeptalk.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Pump yourself up with a peptalk",
    name: "peptalk",
    type: "slash",
    actions: [
	async function (bot, interaction) {
	    const msg = await genPeptalk();
	    ackInteraction(interaction, "message", {}, {content: msg})
	}
    ]
});
