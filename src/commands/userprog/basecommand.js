import {
    ApplicationCommandOptionTypes,
} from "../../../deps.js";
import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";

import { } from "";

import { createCommand } from "./createCommand.js";
import { updateCommand } from "./updateCommand.js";

addBotCommand(bot, {
    description: "Run and Make Custom Programs and Games!",
    name: "usergame",
    options: [{
	name: "create",
	description: "Create a new command",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
	    {
		name: "command",	    
		type: ApplicationCommandOptionTypes.String,
		description: "The name of the command you're making",
		required: true
	    },
	    {
		name: "code",
		type: ApplicationCommandOptionTypes.String,
		description: "The code that makes the program do",
		required: true
	    }
	]
    }, {
	name: "update",
	description: "Update an existing command *you* made",
	type: ApplicationCommandOptionTypes.SubCommand,
	options: [
	    {
		name: "command",	    
		type: ApplicationCommandOptionTypes.String,
		description: "The name of the command you're updating",
		required: true
	    },
	    {
		name: "code",
		type: ApplicationCommandOptionTypes.String,
		description: "The code that makes the program do",
		required: true
	    }
	]
    }],
    type: "slash",
    actions: [
	createCommand,
	updateCommand,
    ]
})
