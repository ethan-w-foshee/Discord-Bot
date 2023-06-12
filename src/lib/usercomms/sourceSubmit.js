import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";


export function sourceCommand(bot, interaction) {
    bot.logger.debug(`${JSON.stringify(interaction)}`);
    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: "Updated command."
    });
    return
}
