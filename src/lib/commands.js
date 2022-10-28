import { Events } from "./commandEvents.js";
import {
    ApplicationCommandTypes,
    InteractionTypes,
    upsertGlobalApplicationCommands,
} from "../../deps.js";

export function enableCommandsPlugin(bot) {
    bot.logger.info("Bot Commands Plugin Enabled");
    bot.commands = [];
    bot.events = {};
    for (const e of Events) {
	bot.events[e] = function (...args) {
	    const commands = bot.commands.filter((comm) => {
		return comm.event == e;
	    });
	    console.log(commands);
	    for (const command of commands) {
		if (Array.isArray(command.actions)) {
		    if (
			command.runIf == undefined ||
			    command.runIf(...args)
		    ) {
			for (const action of command.actions) {
			    if (typeof (action) == "function") {
				bot.logger.debug(`Running command ${command.name}`,"botCommandPlugin");
				action(...args);
			    }
			}
		    }
		} else {
		    /* Will soon be replaced by proper logging */
		    console.log("Should be unreachable");
		}
	    }
	};
    }
}

function filterApplicationCommand(_bot, interaction) {
    if (interaction.type == InteractionTypes.ApplicationCommand) {
	if (interaction.data.name == this.name) {
	    return true;
	}
    }
    return false;
}

const builtinCommandTypes = {
    content: {
	event: "messageCreate",
	type: "Created Message Event",
    },
    slash: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.ChatInput,
	runIf: filterApplicationCommand,
    },
    message: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.Message,
	runIf: filterApplicationCommand,
    },
    user: {
	event: "interactionCreate",
	type: ApplicationCommandTypes.User,
	runIf: filterApplicationCommand,
    },
};

export function addBotCommand(bot, command) {
    const com = command;
    if (com.name == undefined) {
	bot.logger.error(`Commands must have names: ${JSON.stringify(command)}`);
	return null;
    }
    if (com.type in builtinCommandTypes) {
	const commandType = builtinCommandTypes[com.type];
	for (const prop in commandType) {
	    com[prop] = commandType[prop];
	}
    } else if (!com.type) {
	com.type = "Undefined";
    }
    if (!com.event) {
	return null;
    }
    if (com.type != ApplicationCommandTypes.ChatInput) {
	delete com.options;
	delete com.description;
	delete com.descriptionLocalizations;	
    }
    // Command format validated, generate UUID for command
    com.uuid = crypto.randomUUID();
    bot.commands.push(com);
    return com;
}

export function updateBotCommands(bot) {
    const commands = bot.commands.filter((comm) => {
	const upsertedTypes = [
	    ApplicationCommandTypes.ChatInput,
	    ApplicationCommandTypes.Message,
	    ApplicationCommandTypes.User,
	];
	return upsertedTypes.includes(comm.type);
    });
    upsertGlobalApplicationCommands(bot, commands);
}
