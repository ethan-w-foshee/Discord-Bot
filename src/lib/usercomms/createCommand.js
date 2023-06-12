import ackInteraction from "../../util/ackInteraction.js";
import {
    MessageComponentTypes,
    TextStyles,
} from "../../../deps.js";

export function createCommand(_bot, interaction) {
    const createOptions = interaction.data.options.filter(
	o => o.name == "create"
    )[0].options;
    
    const commandId = createOptions?.filter(
	o => o.name == "command"
    )[0];
    
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
