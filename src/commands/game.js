import {
    ApplicationCommandOptionTypes,
//    editOriginalInteractionResponse,
    sendMessage
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import ackInteraction from "../util/ackInteraction.js";

addBotCommand(bot, {
    description: "Play some fun games",
    name: "game",
    options: [{
	name: "chess",
	description: "Play some chess",
	type: ApplicationCommandOptionTypes.SubCommand
    }, {
	name: "hangman",
	description: "Play some hangman",
	type: ApplicationCommandOptionTypes.SubCommand
    }, {
	name: "test",
	description: "Just a test command for now",
	type: ApplicationCommandOptionTypes.SubCommand
    }],
    type: "slash",
    actions: [
	function (bot, interaction) {
	    ackInteraction(interaction);
	    console.log(interaction);
//	    sendMessage(bot, interaction.channelId, {content: `${interaction}`})
	}
    ]
})
