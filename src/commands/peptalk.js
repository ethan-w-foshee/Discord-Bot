import { addBotCommand } from "../lib/commands.js";
import { genPeptalk } from "../util/peptalk/genPeptalk.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Pump yourself up with a peptalk",
    name: "peptalk",
    type: "slash",
    actions: [
	function (_bot, interaction) {
	    // Don't bother "thinking" because if it can't generate quickly enough for the timeout,
	    // there are other problems so whatever
	    ackInteraction(interaction, "message", {}, await genPeptalk());
	}
    ]
});
