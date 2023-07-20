import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";

export function sourceCommand(bot, interaction) {
    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: "Updated command."
    });
    const sourceData = interaction.data.options.filter(
	o => o.name.endsWith("_src_", o.name.length-"create".length)
    )[0];
    const sourceName = sourceData.name;

    // Using Command Name, create/update the command in the DB
    bot.logger.debug(`Creating command for : ${sourceName}`);
    return
}
