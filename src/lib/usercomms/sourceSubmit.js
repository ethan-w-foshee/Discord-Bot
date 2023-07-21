import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";
import { usergameDB } from "./commandDB.js";

export function sourceCommand(bot, interaction) {
    const sourceData = interaction.data;
    const sourceId = sourceData.customId;
    const commandName = sourceId.slice(9,-11)
    const commandSource = sourceData.components[0].components[0].value;
    bot.logger.debug(`Interaction Data: ${JSON.stringify(sourceData)}`);
    const userId = sourceData.member.id;

    if (sourceId.endsWith("create")) {
	const success = usergameDB.createCommand(
	    `${userId}`,
	    commandName,
	    commandSource
	);
	if (success) {
	    ackInteraction(interaction, "message", {ephemeral: true}, {
		content: `Created Command "${commandName}":\`\`\`${commandSource.slice(0,1500)}\`\`\``
	    });
	}else {
	    ackInteraction(interaction, "message", {ephemeral: true}, {
		content: `Failed to Create Command ${commandName}`
	    });
	}
    }else if (sourceId.endsWith("update")) {
	const success = usergameDB.updateCommand(
	    `${userId}`,
	    commandName,
	    commandSource
	);
	if (success) {
	    ackInteraction(interaction, "message", {ephemeral: true}, {
		content: `Updated Command "${commandName}" to:\`\`\`${commandSource.slice(0,1500)}\`\`\``
	    });
	}else {
	    ackInteraction(interaction, "message", {ephemeral: true}, {
		content: `Failed to Create Command ${commandName}`
	    });
	}
    }

    return
}
