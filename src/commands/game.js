import {
    ApplicationCommandOptionTypes,
    MessageComponentTypes,
    ButtonStyles,
    TextStyles,
    editOriginalInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
// import { getNameFromUser } from "../util/quote.js";
import ackInteraction from "../util/ackInteraction.js";

function chess(bot, interaction) {
    const data = interaction.data
    const types = {
	component: 1,
	subcommand: 2
    }
    let type

    console.log(interaction)
    /* Determine if the game interaction is for chess */
    if (data.customId?.includes("chess")) {
	type = types.component
    } else if (data.options) {
	if (data.options.filter((option) =>
	    option.name.includes("chess")
	).length > 0) {
	    type = types.subcommand
	}
    } else {
	/* Exit if not */
	return
    }

    if (type == types.component) {
	switch(data.customId) {
	case "game_chess_play_button":
	    bot.logger.debug("HE PRESSED THE BUTTON")
	    ackInteraction(interaction, "modal", {}, {
		customId: "game_chess_play_modal",
		title: "Enter your move",
		components: [{
		    type: MessageComponentTypes.ActionRow,
		    components: [{
			type: MessageComponentTypes.InputText,
			customId: "game_chess_play_textin",
			style: TextStyles.Short,
			label: "Input string"
		    }]
		}]
	    })
	    break
	case "game_chess_play_modal":
	    bot.logger.debug(`Received modal submission with value:\n${interaction.data.components[0].components[0]}`)
	}
    }

    if (type == types.subcommand) {
	ackInteraction(interaction)	
	const chessOptions = data.options.filter(
	    (option) => option.name.includes("chess")
	)
	
	bot.logger.debug(`Creating chess game with options:\n${chessOptions[0].options}`)
    
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
