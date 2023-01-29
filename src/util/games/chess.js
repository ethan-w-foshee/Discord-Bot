import {
    MessageComponentTypes,
    InteractionTypes,
    TextStyles,
    ButtonStyles,
    editOriginalInteractionResponse,
//    sendMessage,
    deleteMessage,
} from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";
import * as libchess from "../../lib/chess/chess.js";

export default function chess(bot, interaction) {
    const data = interaction.data;

    switch(interaction.type) {
    case InteractionTypes.ModalSubmit: /* falls through */
    case InteractionTypes.MessageComponent: {
	if (data.customId?.includes("chess")) {
	    componentHandler(bot, interaction);
	}
	break;
    } case InteractionTypes.ApplicationCommand: {
	if (data.options?.filter((option) =>
	    option.name.includes("chess")
	).length > 0) {
	    slashHandler(bot, interaction);
	}
	break;
    } default: {
	return;
    }}

    bot.logger.debug("Running a chess command");
}

async function componentHandler(bot, interaction) {
    const needsGameId = ["game_chess_play_button", "game_chess_forfeit_button", "game_chess_play_modal"]
    const component = interaction.data;
    const callerId = interaction.member.id;
    let gameId;

    /* If the component needs a gameId to work, provide some error handling */
    if (needsGameId.includes(component.customId)) {
	/* Get the gameId, fail if not possible */
	try {
	    gameId = "chess." + (interaction.message.embeds[0].fields[0].value +
				 "v" +
				 interaction.message.embeds[0].fields[1].value)
		.replaceAll(/[<@>]/g, "");
	} catch {
	    const data = {
		content: "Something went wrong when getting the game ID"
	    };
	    ackInteraction(interaction, "message", {}, data);
	    return;
	}

	/* If the gameId can be found but the game doesn't exist, fail */
	if (!(await libchess.exists(gameId))) {
	    /* This is a cheap and bad way of detecting if the
	       target message is ephemeral or not. This needs
	       to change at some point but I don't wanna right
	       now. */
	    if (interaction.message.flags != 64) {
		deleteMessage(bot, interaction.message.channelId, interaction.message.id);
	    }
	    const data = {content: "This game does not exist anymore, sorry!"};
	    ackInteraction(interaction, "message", {ephemeral: true}, data);

	    return;
	}	
    }

    switch(component.customId) {
    case "game_chess_play_button": {
	bot.logger.debug("Player pressed play on a chess match");

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
	    };

	    ackInteraction(interaction, "modal", {}, data);
	} else {
	    const data = {content: "You can't play right now!"};
	    ackInteraction(interaction, "message", {ephemeral: true}, data);
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
    } case "game_chess_challenge_accept": {
	break;
    } case "game_chess_play_modal": {
	const playValue = component.components[0].components[0].value;
	bot.logger.debug(`Received chess Play modal submission with value: ${playValue}`);

	const isValid = libchess.valid(await libchess.play(gameId, playValue));

	if (isValid) {
	    ackInteraction(interaction, "deferred");
	    updateBoard(bot, interaction, gameId);
	} else {
	    const data = {
		content: "That's an invalid move! Try again!\n\nFor help on using Algebreic notation, see here: https://www.chess.com/terms/chess-notation"
	    };
	    ackInteraction(interaction, "message", {ephemeral: true}, data);
	}
	break;
    }}
}

async function slashHandler(bot, interaction) {
    const chessOptions = interaction.data.options.filter(
	(option) => option.name.includes("chess")
    )[0].options;

    const opponent = chessOptions.filter(
	(option) => option.name == "user"
    )[0];

    const level = chessOptions.filter(
	(option) => option.name == "level"
    )[0];

    /* Default difficulty */
    const difficulty = level ? level.value : 0;

    bot.logger.debug(`Creating chess game with options:\n${JSON.stringify(chessOptions)}`);

    /* Get participant IDs. Default challenge bot */
    const player1 = interaction.member.id;
    const player2 = opponent ? opponent.value : "Computer";

    /* Determine whether or not this is a private game */
    const isComputer = player2 == "Computer";
    const isSelf = player1 == player2;
    const isPrivate = (isSelf || isComputer)

    /* If the game is private, enable the "ephemeral" flag */
    const flags = isPrivate ? {ephemeral: true} : {};
    
    ackInteraction(interaction, "thinking", flags);    

    /* Generate game ID based on competitors */
    const gameId = "chess." + player1 + "v" + player2;

    if (libchess.exists(gameId)) {
	/* If the game already exists, just present it */	
	bot.logger.info(`Chess game ${gameId} already exists, presenting`);
	updateBoard(bot, interaction, gameId);
    } else {
	if (isPrivate) {
	    /* If not, but the game is private, just create it */
	    await libchess.make(gameId, isComputer, difficulty)
	    updateBoard(bot, interaction, gameId);
	} else {
	    /* Otherwise, send a challenge */
	    challenge(bot, interaction, player1, player2);
	}
    }
}

function challenge(bot, interaction, player1, player2) {
    const data = {
	content: `<@${player2}>! You have been challenged to a chess match by <@${player1}>! Do you accept?`,
	components: [{
	    type: MessageComponentTypes.ActionRow,
	    components: [{
		type: MessageComponentTypes.Button,
		customId: "game_chess_challenge_accept",
		style: ButtonStyles.Success,
		label: "Accept",
	    }, {
		type: MessageComponentTypes.Button,
		customId: "game_chess_challenge_decline",
		style: ButtonStyles.Danger,
		label: "Decline",
	    }]
	}]
    };
    editOriginalInteractionResponse(bot, interaction.token, data);
}

async function updateBoard(bot, interaction, gameId) {
    const color = await libchess.color(gameId);
    const turnNum = await libchess.turn(gameId);
    const board = await libchess.board(gameId);
    const players = gameId.split(".")[1].split("v");
    const playerTag1 = `<@${players[0]}>`;
    const playerTag2 = players[1] == "Computer" ? players[1] : `<@${players[1]}>`;

    /* The default ansii color codes don't work. Let's make
       it dark mode! */
    const coloredBoard = board.replaceAll(";37", ";40").replaceAll(";35", ";42");

    const data = {
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
		customId: "game_chess_forfeit_button",
		style: ButtonStyles.Secondary,
		label: "Forfeit",
	    }]
	}]
    };
    
    editOriginalInteractionResponse(bot, interaction.token, data);

}

async function checkMyTurn(gameId, userId) {
    /* Return whether or not it is the user's turn */
    const whitePlayer = gameId.split(".")[1].split("v")[0];
    const blackPlayer = gameId.split(".")[1].split("v")[1];
    const color = await libchess.color(gameId);

    return (color == "Black" && (blackPlayer == userId) ||
	    color == "White" && (whitePlayer == userId));
}
