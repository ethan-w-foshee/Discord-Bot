import {
    MessageComponentTypes,
    TextStyles,
    ButtonStyles,
    editOriginalInteractionResponse,
    sendMessage,
} from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";
import * as libchess from "../../lib/chess/chess.js";

const turns = {
    white: 0,
    black: 1,
}

class ChessGame {
    constructor(bot, id, player1, player2) {
	libchess.make(id)

	this.bot = bot
	this.id = id
	this.player1 = player1
	this.player2 = player2
	libchess.board(id).then((result) => this.board = result)
	this.turn = turns.white

	this.update()
    }

    update() {
	console.log(this.board)
	console.log(typeof(this.board))
	editOriginalInteractionResponse(
	    this.bot,
	    this.id,
	    {
		embeds: [{
		    title: "Chess match",
		    timestamp: new Date(Date.now()).toISOString(),
		    color: this.turn == turns.white ? 0xffffff : 0x000000,
		    fields: [{
			name: "White",
			value: this.player1,
			inline: true,
		    }, {
			name: "Black",
			value: this.player2,
			inline: true,
		    }, {
			name: "Turn",
			value: this.turn == turns.white ? "White" : "Black",
		    }, {
			name: "Board",
			value: this.board,
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
		}],
	    }
	)
    }
}
const games = []

export default function chess(bot, interaction) {
    const data = interaction.data
    const types = {
	component: 1,
	subcommand: 2
    }
    let type

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

    bot.logger.debug("Running a chess command")
    
    if (type == types.component) {
	componentHandler(bot, interaction)
    }

    if (type == types.subcommand) {
	createMatch(bot, interaction)
    }
}

function componentHandler(bot, interaction) {
    const component = interaction.data
    switch(component.customId) {
    case "game_chess_play_button":
	bot.logger.debug("Player pressed play on a chess match")
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
	bot.logger.debug(`Received chess modal submission with value:\n${JSON.stringify(component.components[0].components[0])}`)
    }
}

function createMatch(bot, interaction) {
    ackInteraction(interaction)
    const chessOptions = interaction.data.options.filter(
	(option) => option.name.includes("chess")
    )[0].options

    const challenge = chessOptions.filter(
	(option) => option.name == "user"
    )
    
    bot.logger.debug(`Creating chess game with options:\n${JSON.stringify(chessOptions)}`)

    const player1 = "<@" + interaction.member.id + ">"
    const player2 = challenge.length > 0 ? "<@" + challenge[0].value + ">" : "Bot"

    games.push(new ChessGame(bot, interaction.token, player1, player2))
    
    if (player2 != "Bot") {
	sendMessage(bot, interaction.channelId, {
	    content: `${player2}! You have been challenged to a chess match by ${player1}`
	})
    }
}

// function editEmbed(player1, player2, turn, board) {
//     const color = turn == turns.white ? 0xffffff : 0x000000
//     return {
// 	embeds: [{
// 	    title: "Chess match",
// 	    timestamp: new Date(Date.now()).toISOString(),
// 	    color: color,
// 	    fields: [{
// 		name: "White",
// 		value: player1,
// 		inline: true,
// 	    }, {
// 		name: "Black",
// 		value: player2,
// 		inline: true,
// 	    }, {
// 		name: "Turn",
// 		value: turn == turns.white ? "White" : "Black",
// 	    }, {
// 		name: "Board",
// 		value: board,
// 	    }]
// 	}],
// 	components: [{
// 	    type: MessageComponentTypes.ActionRow,
// 	    components: [{
// 		type: MessageComponentTypes.Button,
// 		customId: "game_chess_play_button",
// 		style: ButtonStyles.Primary,
// 		label: "Play!"
// 	    }]
// 	}],
// 	flags: ApplicationCommandFlags.Ephemeral
//     }
// }
