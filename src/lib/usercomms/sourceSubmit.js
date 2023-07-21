import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";

export function sourceCommand(_bot, interaction) {
    const sourceData = interaction.data.options.filter(
	o => o.customId.endsWith("src",o.customId.length-"_create".length)
    )[0];
    const sourceId = sourceData.customId;
    const commandName = sourceId.slice(9,-11)
    const commandSource = sourceData.components[0].components.value;

    if (sourceId.endsWith("create")) {

    }else if (sourceId.endsWith("update")) {

    }

    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: `Created Command "${commandName}":\`\`\`${commandSource}\`\`\``
    });

    return
}
