import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";

export function sourceCommand(_bot, interaction) {
    const sourceData = interaction.data;
    const sourceId = sourceData.customId;
    const commandName = sourceId.slice(9,-11)
    const commandSource = sourceData.components[0].components[0].value;

    if (sourceId.endsWith("create")) {
	console.log("TODO");
    }else if (sourceId.endsWith("update")) {
	console.log("TODO");
    }

    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: `Created Command "${commandName}":\`\`\`${commandSource.slice(0,1500)}\`\`\``
    });

    return
}
