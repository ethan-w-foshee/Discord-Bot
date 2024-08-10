import {
    ApplicationCommandOptionTypes,
    editOriginalInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { tenorGenerate } from "../lib/tenor.js";
import ackInteraction from  "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Send a very relevant gif",
    name: "wwcs",
    options: [{
	name: "message",
	description: "What are you trying to say?",
	type: ApplicationCommandOptionTypes.String,
	required: true,
    }],
    type: "slash",
    actions: [
	async function (bot, interaction) {
	    ackInteraction(interaction);

	    /* Get options */
	    const options = interaction.data.options;

	    const message = options.filter((option) =>
		option.name == "message"
	    )[0].value;

	    const tenor_resp = await tenorGenerate(message);

	    // We also get a description back
	    // Do we want to send that in a rich embed
	    // With the gif?
	    
	    editOriginalInteractionResponse(
		bot,
		interaction.token,
		{ content: tenor_resp['url'] },
	    );
	},
    ],
});

addBotCommand(bot, {
    description: "Turn a message into an inspriational quote",
    name: "gifize",
    type: "message",
    actions: [
	async function (bot, interaction) {
	    ackInteraction(interaction);
	    const messageObject =
		interaction.data.resolved.messages.values().next().value;
	    
            const message = messageObject.content;
	    const tenor_resp = await tenorGenerate(message);

	    editOriginalInteractionResponse(
		bot,
		interaction.token,
		{ content: tenor_resp['url'] },
	    );
	},
    ],
});
