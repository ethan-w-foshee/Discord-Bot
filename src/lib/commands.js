import { Events } from "./commandEvents.js";
import { ApplicationCommandOptionTypes,
	 upsertGlobalApplicationCommands,
	 ApplicationCommandTypes,
         v5 } from "../../deps.js";

export function enableCommandsPlugin(bot) {
    bot.commands = {};
    bot.events = {};
    for (e of Events) {
	bot.commands[e] = {};
	bot.events[e] = function(...args) {
	    for (command of bot.commands[e]) {
		if (command.actions.isArray()) {
		    for (action of command.actions) {
			if (typeof(action) == "function") {
			    action(...args);
			}
		    }
		}else {
		    /* Will soon be replaced by proper logging */
		    console.log("Should be unreachable")
		}
	    }
	}
    }
}

const builtinCommandTypes = {
    content: {
	event: "messageCreate",
	type: "Created Message Event"
    },
    slash: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.ChatInput
    },
    message: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.Message
    },
    user: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.User
    }
};

export function addBotCommand(bot, command) {
    if (com.type in builtinCommandTypes) {
	for (prop in builtinCommandTypes[com.type]) {
	    com[prop] = builtinCommandTypes[com.type][prop];
	}
    }
    if (!com.event) {
	return null
    }
    // Command format validated, generate UUID for command
    com.uuid = v5.generate()
    return com
}

export function updateBotCommands(bot) {
    upsertGlobalApplicationCommands(bot, bot.commands);
}
