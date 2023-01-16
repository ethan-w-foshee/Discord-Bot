import {
    ApplicationCommandOptionTypes,
    MessageComponentTypes,
    ButtonStyles,
//    TextStyles,
    editOriginalInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
// import { getNameFromUser } from "../util/quote.js";
import ackInteraction from "../util/ackInteraction.js";

function chess(bot, interaction) {
    /* Determine if the game interaction is for chess */
    const chessOptions = interaction.data.options?.filter(
	(option) => option.name.includes("chess")
    )
    
    if (chessOptions?.length == 0 && !interaction.data.name.includes("chess"))
	return /* Exit if not */

    console.log(interaction);

    ackInteraction(interaction)

    if (chessOptions[0].name == "chess") {
	console.log(`Creating chess game with options:\n${chessOptions[0].options}`)
    
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
			type: MessageComponentTypes.Button,
			customId: "game_chess_play_button",
			style: ButtonStyles.Primary,
			label: "Play!"
		    }]
		}]
	    });
    }
}

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
	chess
    ]
})
