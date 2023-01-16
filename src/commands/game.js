import {
    ApplicationCommandOptionTypes,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import chess from "../util/games/chess.js";

addBotCommand(bot, {
    description: "Play some fun games",
    name: "game",
    options: [{
	name: "chess",
	description: "Play some chess",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [{
	    name: "user",	    
	    type: ApplicationCommandOptionTypes.User,
	    description: "The user you want to challenge to Chess. Leave empty to play the bot",
	    required: false
	}]
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
