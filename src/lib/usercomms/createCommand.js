import ackInteraction from "../../util/ackInteraction.js";
import {
    editOriginalInteractionResponse,
} from "../../../deps.js";

export function createCommand(bot, interaction) {
    ackInteraction(
	interaction,
	"thinking",
	{ephemeral: true},
	{content: `Creating command now...`}
    );
    editOriginalInteractionResponse(
	bot,
	interaction.token,
	{
	    content: "Command created!"
	}
    );
    return
}
