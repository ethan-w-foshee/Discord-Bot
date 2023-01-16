import {
    MessageComponentTypes,
    TextStyles,
    ButtonStyles,
    editOriginalInteractionResponse,
    sendMessage,
} from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";
import * as libchess from "../../lib/chess/chess.js";

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
    case "game_chess_play_button": {
	bot.logger.debug("Player pressed play on a chess match")

	const callerId = interaction.member.id
	
	const isParticipant = (interaction.embeds[0].fields[0].value.contains(callerId)) || (interaction.embeds[0].fields[1].value.contaienrs(callerId))

	if (isParticipant) {    
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
	} else {
	    ackInteraction(interaction, "message", {ephemeral: true}, {
		content: "You are not a player in this game"
	    })
	}
	break
    } case "game_chess_play_modal": {
	bot.logger.debug(`Received chess modal submission with value:\n${JSON.stringify(component.components[0].components[0])}`)
	ackInteraction(interaction, "message", {ephemeral: true}, {content: "thanks for presing the button"})
    }
    }
}

async function createMatch(bot, interaction) {
    ackInteraction(interaction)
    const chessOptions = interaction.data.options.filter(
	(option) => option.name.includes("chess")
    )[0].options

    const challenge = chessOptions.filter(
	(option) => option.name == "user"
    )
    
    bot.logger.debug(`Creating chess game with options:\n${JSON.stringify(chessOptions)}`)

    const player1 = interaction.member.id
    const player2 = challenge.length > 0 ? challenge[0].value : "computer"

    const gameId = player1 + "v" + player2

    if (!(libchess.exists(gameId))) {
	if (player2 != "computer") {
	    sendMessage(bot, interaction.channelId, {
		content: `<@${player2}>! You have been challenged to a chess match by <@${player1}>`
	    })	
	}	
	await libchess.make(gameId)
    }

    updateEmbed(bot, interaction, gameId)
}

async function updateEmbed(bot, interaction, gameId) {
    const color = await libchess.color(gameId)
    const turnNum = await libchess.turn(gameId)
    const board = await libchess.board(gameId)
    const players = gameId.split("v")
    const playerTag1 = `<@${players[0]}>`
    const playerTag2 = players[1] == "computer" ? "Computer" : `<@${players[1]}>`

    editOriginalInteractionResponse(
	bot,
	interaction.token,
	{
	    embeds: [{
		title: "Chess match",
		timestamp: new Date(Date.now()).toISOString(),
		color: color == "White" ? 0xffffff : 0x000000,
		fields: [{
		    name: "White",
		    value: playerTag1,
		    inline: true,
		}, {
		    name: "Black",
		    value: playerTag2,
		    inline: true,
		}, {
		    name: "Turn",
		    value: `${turnNum} (${color})`,
		}, {
		    name: "Board",
		    value: board,
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
	    flags: ApplicationCommandFlags.Ephemeral
	}
    )
}
