import {
    ApplicationCommandOptionTypes,
} from "../../../deps.js";
import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";

import { } from "../../lib/usercomms/commandDB.js";

import { masterAction } from "../../lib/usercomms/masterAction.js";

const maxCommandName = 30;

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
		required: true,
		max_length: maxCommandName
	    },
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
		required: true,
		max_length: maxCommandName
	    },
	]
    }],
    type: "slash",
    actions: [
	masterAction
    ]
})
