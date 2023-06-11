import ackInteraction from "../../util/ackInteraction.js";
import {
    MessageComponentTypes,
} from "../../../deps.js";

export function createCommand(_bot, interaction) {
    const createOptions = interaction.options.filter(
	o => o.name == "create"
    )[0].options;

    const commandId = createOptions.options.filter(
	o => o.name == "command"
    )[0];
    
    ackInteraction(
	interaction,
	"modal",
	{},
	{
	    // TODO: Actually get ID
	    customId: `usercomm_${commandId}_src_create`,
	    title: "",
	    components: [{
		type: MessageComponentTypes.ActionRow,
		components: [{
		    type: MessageComponentTypes.InputText,
		    customId: `usercomm_${commandId}_source`,
		    style: TextStyles.Paragraph,
		    label: "Source Code"
		}]	
	    }]
	}
    );
}
