import ackInteraction from "../../util/ackInteraction.js";
import {
    editOriginalInteractionResponse,
} from "../../../deps.js";


export function sourceCommand(bot, interaction) {
    bot.logger.debug(`${interaction}`);
    ackInteraction(interaction, "deferred", {ephemeral: true}, {
	content: "Updating command..."
    })

    editOriginalInteractionResponse(
	bot,
	interaction.token,
	{
	    content: "Command created!"
	}
    );
    return
}
