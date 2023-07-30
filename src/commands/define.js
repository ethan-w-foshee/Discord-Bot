import { ApplicationCommandOptionTypes, InteractionTypes } from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { sendDefinition } from "../util/define/send_definition.js";
import { freedictDefine } from "../util/define/freedictionary.js";
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
	commandHandler
    ]
});

async function commandHandler(bot, interaction) {
    ackInteraction(interaction);

    let result, dictUsed;

    if (interaction.type == InteractionTypes.MessageComponent) {
	dictUsed = 0;
	const options = interaction.data.customId.split("_");
	result = await freedictDefine(options[1], options[2]);
    } else {
	/* Get options */
	const options = interaction.data.options;
	const word = options.filter((option) =>
	    option.name == "word"
	)[0].value;

	const urbanDictOption = options.filter((option) =>
	    option.name == "urban"
	)[0];
	const urbanDict = urbanDictOption ? urbanDictOption.value : ((Math.floor(Math.random() * 100)) < 20);

	/* Get definition */
	if (urbanDict) {
	    result = await urbanDictDefine(word);
	    dictUsed = 1;
	} else {
	    result = await freedictDefine(word);
	    dictUsed = 0;
	}
    }

    sendDefinition(bot, interaction, result, dictUsed);
}
