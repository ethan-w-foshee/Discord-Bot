import { ApplicationCommandOptionTypes } from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { stupidify } from "../util/stupidenglish.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
	description: "Send a message but without a few letters",
	name: "stupidenglish",
	options: [{
		name: "content",
		description: "The original message to be \"corrected\"",
		type: ApplicationCommandOptionTypes.String,
		required: true,
	}],
	type: "slash",
	actions: [
		function (_bot, interaction) {
			/* Get options */
			const options = interaction.data.options

			const inval = options.filter((option) =>
				option.name == "content"
			)[0].value;

			ackInteraction(interaction, "message", '', { content: stupidify(inval) })
		}
	]
});

addBotCommand(bot, {
	description: "Stupify a message",
	name: "stupidenglish",
	type: "message",
	actions: [
		function (bot, interaction) {
			/* Get options */
			const options = interaction.data.options

			const inval = options.filter((option) =>
				option.name == "content"
			)[0].value;

			ackInteraction(interaction, "message", '', { content: stupidify(inval) })
		},
	],
});