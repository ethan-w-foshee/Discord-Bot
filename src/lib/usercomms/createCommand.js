import ackInteraction from "../../util/ackInteraction.js";
import {
    MessageComponentTypes,
    TextStyles,
} from "../../../deps.js";
import { usergameDB } from "./commandDB.js";

export function createCommand(bot, interaction) {
    const createOptions = interaction.data.options.filter(
	o => o.name == "create"
    )[0].options;

    bot.logger.debug(`Creating command from... ${JSON.stringify(createOptions)}`);
    
    const commandId = createOptions.filter(
	o => o.name == "command"
    )[0]["value"];

    // Check if command name exists, if it does, complain
    // Otherwise present the modal

    const exists = usergameDB.searchCommand({name: commandId})

    if (exists.length != 0) {
	ackInteraction(
	    interaction,
	    "message",
	    {},
	    {
		content: `Command with name ${commandId} already exists`
	    }
	);
    }else {
	ackInteraction(
	    interaction,
	    "modal",
	    {},
	    {
		// TODO: Actually get ID
		customId: `usergame_${commandId}_src_create`,
		title: `${commandId}: Code Creation`,
		components: [{
		    type: MessageComponentTypes.ActionRow,
		    components: [{
			type: MessageComponentTypes.InputText,
			customId: `usergame_${commandId}_source`,
			style: TextStyles.Paragraph,
			label: "Source Code"
		    }]	
		}]
	    }
	);
    }
}
