import {
    ApplicationCommandOptionTypes,
    MessageComponentTypes,    
    TextStyles,
    editOriginalInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
// import { getNameFromUser } from "../util/quote.js";
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
	    ackInteraction(interaction)

	    editOriginalInteractionResponse(
		bot,
		interaction.token,
		{
		    embeds: [{
			title: "Chess match",
			timestamp: new Date(Date.now()).toISOString(),
			color: 0xffffff,
			fields: [{
			    name: "Player 1",
			    value: "Nobody yet",
			    inline: true
			}, {
			    name: "Player 2",
			    value: "Nobody yet",
			    inline: true
			}, {
			    name: "Board",
			    value: "WIP"
			}]
		    }],
		    components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
			    type: MessageComponentTypes.InputText,
			    customId: "game_chess_play",
			    style: TextStyles.Short,
			    label: "Your move"
			}]
		    }]
		});
	    console.log(interaction);
	}
    ]
})
