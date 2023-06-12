import ackInteraction from "../../util/ackInteraction.js";
import {
} from "../../../deps.js";

export function sourceCommand(_bot, interaction) {
    ackInteraction(interaction, "message", {ephemeral: true}, {
	content: "Updated command."
    });
    return
}
