import {
    MessageComponentTypes,
    InteractionTypes,
    TextStyles,
    ButtonStyles,
    editOriginalInteractionResponse,
    sendMessage,
    deleteMessage,
} from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";
import * as libchess from "../../lib/chess/chess.js";

export default function chess(bot, interaction) {
    const data = interaction.data;

    switch(interaction.type) {
    case InteractionTypes.MessageComponent: /* falls through */
    case InteractionTypes.ModalSubmit: {
	if (data.customId?.includes("chess")) {
	    /* Calc some variables used in both handlers*/
	    /* Get Game ID */
	    let gameId;
	    try {
		gameId = "chess." + (interaction.message.embeds[0].fields[0].value +
			  "v" +
			  interaction.message.embeds[0].fields[1].value).replaceAll(/[<@>]/g, "");
	    } catch {
		const data = {
		    content: "Something went wrong when getting the game ID"
		};
		ackInteraction(interaction, "message", {}, data);
		return;
	    }

	    /* Shorthand for the component */
	    const component = interaction.data;

	    if (interaction.type == InteractionTypes.ModalSubmit) {
		modalHandler(bot, interaction, gameId, component);
	    } else if (interaction.type == InteractionTypes.MessageComponent) {
		componentHandler(bot, interaction, gameId, component);
	    }
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

async function componentHandler(bot, interaction, gameId, component) {
    const callerId = interaction.member.id;

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
    } case "game_chess_refresh_button": {
	bot.logger.debug(`Refreshing board for game ${gameId}`);

	ackInteraction(interaction, "deferred");
	updateEmbed(bot, interaction, gameId);
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

async function modalHandler(bot, interaction, gameId, component) {

    switch(component.customId) {
    case "game_chess_play_modal": {
	const playValue = component.components[0].components[0].value;
	bot.logger.debug(`Received chess Play modal submission with value: ${playValue}`);

	const isValid = libchess.valid(await libchess.play(gameId, playValue));

	if (isValid) {
	    ackInteraction(interaction, "deferred");
	    updateEmbed(bot, interaction, gameId);
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

    const challenge = chessOptions.filter(
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
    const player2 = challenge ? challenge.value : "Computer";

    /* If the game doesn't exist, make it */
    await createGame(bot, interaction, player1, player2, difficulty);

    /* Fetch the game. If the game did exist already,
       this will display the game in whatever state it
       was in previously */
    updateEmbed(bot, interaction, gameId);
}

async function createGame(bot, interaction, player1, player2, difficulty) {
    /* Generate game ID based on competitors */
    const gameId = "chess." + player1 + "b" + player2;

    /* Determine whether or not this is a private game */
    const isComputer = player2 == "Computer";
    const isSelf = player1 == player2;

    /* If the game is private, enable the "ephemeral" flag */
    const flags = (isSelf || isComputer) ? {ephemeral: true} : {};

    ackInteraction(interaction, "thinking", flags);

    if (!(libchess.exists(gameId))) {
	
	/* If this is NOT a private game, alert the opponent */
	if ( !(isComputer || isSelf) ) {
	    const data = {
		content: `<@${player2}>! You have been challenged to a chess match by <@${player1}>`
	    };
	    sendMessage(bot, interaction.channelId, data);
	}
	await libchess.make(gameId, isComputer, difficulty);
    }
}

async function updateEmbed(bot, interaction, gameId) {
    const color = await libchess.color(gameId);
    const turnNum = await libchess.turn(gameId);
    const board = await libchess.board(gameId);
    const players = gameId.split("v");
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
    };
    
    editOriginalInteractionResponse(bot, interaction.token, data);

}

async function checkMyTurn(gameId, userId) {
    /* Return whether or not it is the user's turn */
    const whitePlayer = gameId.split("v")[0];
    const blackPlayer = gameId.split("v")[1];
    const color = await libchess.color(gameId);

    return (color == "Black" && (blackPlayer == userId) ||
	    color == "White" && (whitePlayer == userId));
}
