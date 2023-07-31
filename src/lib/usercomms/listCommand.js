import ackInteraction from "../../util/ackInteraction.js";
import {} from "../../../deps.js";
import { usergameDB } from "./commandDB.js";

export function listCommand(bot, interaction) {
    const createOptions = interaction.data.options.filter(
	o => o.name == "list"
    )[0].options;
 
    const allCommands = usergameDB.searchCommand()

    ackInteraction(
	interaction,
	"message",
	{ephemeral: true},
	{
	    content: `${allCommands.length} Commands exist!`
	}
    );
    return
}
