import { ApplicationCommandOptionTypes } from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { sendDefinition } from "../util/define/send_definition.js";
import { collinsDefine } from "../util/define/collins.js";
import { urbanDictDefine } from "../util/define/urbandict.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Define a word",
    name: "define",
    options: [{
	name: "word",
	description: "The word to be defined",
	type: ApplicationCommandOptionTypes.String,
	required: true,
    },{
	name: "urban",
	description: "Whether or not to use urban dictionary",
	type: ApplicationCommandOptionTypes.Boolean,
	required: false,
    }],
    type: "slash",
    actions: [
	function (bot, interaction) {
	    ackInteraction(interaction)
	    /* Get options */
	    const options = interaction.data.options
	    const word = options.filter((option) =>
		option.name == "word"
	    )[0].value;
	    const urbanDict = options.filter((option) =>
		option.name == "urban"
	    )[0].value || ((Math.floor(Math.random() * 100)) < 20);

	    /* Get definition */
	    let result, dictUsed
	    if (urbanDict) {
		result = urbanDictDefine(word);
		dictUsed = 1
	    } else {
		result = collinsDefine(word);
		dictUsed = 0
	    }

	    sendDefinition(bot, interaction, result, dictUsed);
	    ackInteraction(interaction, "message", {}, { content: stupidify(inval) })
	}
    ]
});
