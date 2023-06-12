import ackInteraction from "../../util/ackInteraction.js";
import {
    editOriginalInteractionResponse,
} from "../../../deps.js";


export function sourceCommand(bot, interaction) {
    bot.logger.debug(`${JSON.stringify(interaction)}`);
    ackInteraction(interaction, "thinking", {ephemeral: true}, {
	content: "Updating command..."
    });

    editOriginalInteractionResponse(
	bot,
	interaction.token,
	{
	    content: "Command created!"
	}
    );
    return
}
