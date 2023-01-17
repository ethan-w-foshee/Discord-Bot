import {
    MessageComponentTypes,
    TextStyles,
    ButtonStyles,
    editOriginalInteractionResponse,
    sendMessage,
    deleteMessage,
} from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";
import * as libchess from "../../lib/chess/chess.js";
import { bot } from "../../../bot.js";

export default function chess(bot, interaction) {
    console.log(interaction)
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
	componentHandler(interaction)
    }

    if (type == types.subcommand) {
	createMatch(interaction)
    }
}

async function componentHandler(interaction) {
    const component = interaction.data
    const callerId = interaction.member.id
    let gameId

    try {
	gameId = (interaction.message.embeds[0].fields[0].value +
		  "v" +
		  interaction.message.embeds[0].fields[1].value).replaceAll(/[<@>]/g, "").toLowerCase()
    } catch {
	const data = {
	    content: "Something went wrong when getting the game ID"
	}
	ackInteraction(interaction, "message", {}, data)
	return
    }

    if (!(await libchess.exists(gameId))) {
	console.log(interaction.message);
	deleteMessage(bot, interaction.message.channelId, interaction.message.id);
	const data = {content: "This game does not exist anymore, sorry!"}
	ackInteraction(interaction, "message", {ephemeral: true}, data)

	return
    }

    switch(component.customId) {
    case "game_chess_play_button": {
	bot.logger.debug("Player pressed play on a chess match")

	if (await checkMyTurn(gameId, callerId)) {
	    const data = {
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
	    }

	    ackInteraction(interaction, "modal", {}, data)
	} else {
	    const data = {content: "You can't play right now!"}
	    ackInteraction(interaction, "message", {ephemeral: true}, data)
	}
	break
    } case "game_chess_refresh_button": {
	bot.logger.debug(`Refreshing board for game ${gameId}`)

	ackInteraction(interaction, "deferred")
	updateEmbed(interaction, gameId)
	break
    } case "game_chess_play_modal": {
	const playValue = component.components[0].components[0].value
	bot.logger.debug(`Received chess modal submission with value:\n${playValue}`)

	const isValid = libchess.valid(await libchess.play(gameId, playValue))

	if (isValid) {
	    ackInteraction(interaction, "deferred")
	    updateEmbed(interaction, gameId)
	} else {
	    const data = {
		content: "That's an invalid move! Try again!\n\nFor help on using Algebreic notation, see here: https://www.chess.com/terms/chess-notation"
	    }
	    ackInteraction(interaction, "message", {ephemeral: true}, data)
	}
	break;
    } case "game_chess_forfeit_button": {
	if (await checkMyTurn(gameId, callerId)) {
	    bot.logger.debug(`Player is ending chess game ${gameId}`);

	    const embed = interaction.message.embeds[0];
	    embed.title = "Chess Match (Ended)";
	    embed.color = 0xff444444;
	    embed.timestamp = new Date(Date.now()).toISOString();

	    const data = {
		embeds: [embed],
		components: [],
	    };
	    ackInteraction(interaction, "update", {}, data);

	    libchess.close(gameId);
	} else {
	    const data = {
		content: "You can only forfeit on your turn!",
	    };
	    ackInteraction(interaction, "message", {ephemeral: true}, data);
	}
	break;
    }}
}

async function createMatch(interaction) {
    const chessOptions = interaction.data.options.filter(
	(option) => option.name.includes("chess")
    )[0].options;

    const challenge = chessOptions.filter(
	(option) => option.name == "user"
    )[0];

    const level = chessOptions.filter(
	(option) => option.name == "level"
    )[0];

    const difficulty = level ? level.value : 0;

    bot.logger.debug(`Creating chess game with options:\n${JSON.stringify(chessOptions)}`);

    const player1 = interaction.member.id;
    const player2 = challenge ? challenge.value : "computer";

    const isComputer = player2 == "computer";
    const isSelf = player1 == player2;

    const flags = (isSelf || isComputer) ? {ephemeral: true} : {};

    ackInteraction(interaction, "thinking", flags);

    const gameId = player1 + "v" + player2;

    if (!(libchess.exists(gameId))) {
	if ( !(isComputer || isSelf) ) {
	    sendMessage(bot, interaction.channelId, {
		content: `<@${player2}>! You have been challenged to a chess match by <@${player1}>`
	    });
	}
	await libchess.make(gameId, isComputer, difficulty);
    }

    updateEmbed(interaction, gameId);
}

async function updateEmbed(interaction, gameId) {
    const color = await libchess.color(gameId);
    const turnNum = await libchess.turn(gameId);
    const board = await libchess.board(gameId);
    const players = gameId.split("v");
    const playerTag1 = `<@${players[0]}>`;
    const playerTag2 = players[1] == "computer" ? "Computer" : `<@${players[1]}>`;

    const coloredBoard = board.replaceAll(";37", ";40").replaceAll(";35", ";42");

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
		    value: `\`\`\`ansi
${coloredBoard}
\`\`\``,
		}]
	    }],
	    components: [{
		type: MessageComponentTypes.ActionRow,
		components: [{
		    type: MessageComponentTypes.Button,
		    customId: "game_chess_play_button",
		    style: ButtonStyles.Primary,
		    label: "Play!",
		},{
		    type: MessageComponentTypes.Button,
		    customId: "game_chess_refresh_button",
		    style: ButtonStyles.Secondary,
		    label: "Refresh board",
		},{
		    type: MessageComponentTypes.Button,
		    customId: "game_chess_forfeit_button",
		    style: ButtonStyles.Danger,
		    label: "Forfeit",
		}]
	    }]
	}
    );
}

async function checkMyTurn(gameId, userId) {
    const whitePlayer = gameId.split("v")[0]
    const blackPlayer = gameId.split("v")[1]
    const color = await libchess.color(gameId)

    return (color == "Black" && (blackPlayer == userId) ||
	    color == "White" && (whitePlayer == userId))
}
