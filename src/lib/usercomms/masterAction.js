import {
    InteractionTypes,
    MessageComponentTypes,
    TextStyles,
} from "../../../deps.js";

import { createCommand } from "../../lib/usercomms/createCommand.js";
import { updateCommand } from "../../lib/usercomms/updateCommand.js";
import { sourceCommand } from "../../lib/usercomms/sourceSubmit.js";
import { runCommand } from "../../lib/usercomms/runCommand.js";
import { deleteCommand } from "../../lib/usercomms/deleteCommand.js";

const subcommands = {
    "create": createCommand,
    "update": updateCommand,
    "src": sourceCommand,
    "run": runCommand,
    "delete": deleteCommand,
};

export function masterAction(bot, interaction) {
    const data = interaction.data;
    bot.logger.debug(`Received and running UserComm`)

    switch(interaction.type) {
	case InteractionTypes.ModalSubmit:
	case InteractionTypes.MessageComponent: {
	    if (!data.customId.includes("usergame"))
		return;
	    const commInstr = data.customId.split('_');
	    const action = commInstr[2];
	    if (action in subcommands) {
		subcommands[action](bot, interaction)
		return;
	    }
	    /* TODO:
	       Decide format for custom modals run by user code
	     */
	    break;
	}
	case InteractionTypes.ApplicationCommand: {
	    if (!data.options)
		return;
	    for (const option of data.options) {
		if (option.name in subcommands) {
		    subcommands[option.name](bot, interaction);
		    break;
		}
	    }
	    break;
	} default: {
	    return;
	}
    }
}

export function masterRunAction(bot, interaction) {
    switch(interaction.type) {
	case InteractionTypes.ModalSubmit:
	case InteractionTypes.MessageComponent: {
	    if (!data.customId.includes("userrun"))
		return;
	    const commInstr = data.customId.split('_');
	    const action = commInstr[1];
	    if (action in subcommands) {
		subcommands[action](bot, interaction)
		return;
	    }
	    break;
	}
	case InteractionTypes.ApplicationCommand: {
	    ackInteraction(
		interaction,
		"modal",
		{},
		{
		    customId: `userrun_run`,
		    title: `Run a Command`,
		    components: [{
			type: MessageComponentTypes.ActionRow,
			components: [{
			    type: MessageComponentTypes.InputText,
			    customId: `command`,
			    style: TextStyles.Short,
			    label: "Command Name"
			}]	
		    }]
		}
	    );
	    break;
	} default: {
	    return;
	}
    }    
}
