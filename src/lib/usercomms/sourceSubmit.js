import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";

export function sourceCommand(bot, interaction) {
    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: "Updated command."
    });
    // Using Command Name, create/update the command in the DB
    bot.logger.debug(`Creating command for : ${JSON.stringify(interaction)}`);
    return
}
