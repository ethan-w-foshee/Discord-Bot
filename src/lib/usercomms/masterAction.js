import {
    InteractionTypes,
} from "../../../deps.js";

import { createCommand } from "../../lib/usercomms/createCommand.js";
import { updateCommand } from "../../lib/usercomms/updateCommand.js";
import { sourceCommand } from "../../lib/usercomms/sourceSubmit.js";

const subcommands = {
    "create": createCommand,
    "update": updateCommand,
    "src": sourceCommand,
};

export function masterAction(bot, interaction) {
    const data = interaction.data;
    bot.logger.debug(`Received and running UserComm`)
    bot.logger.debug(`2: Received and running UserComm`,"UserComm")

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
