import ackInteraction from "../../util/ackInteraction.js";
import {} from "../../../deps.js";
import { usergameDB } from "./commandDB.js";

export function infoCommand(bot, interaction) {
    const createOptions = interaction.data.options.filter(
	o => o.name == "info"
    )[0].options;
    
    commandId = createOptions.filter(
	o => o.name == "command"
    )[0]["value"];
    
    bot.logger.debug(`Running command ${commandId}`);

    const exists = usergameDB.searchCommand({name: commandId})

    if (exists.length == 0) {
	ackInteraction(
	    interaction,
	    "message",
	    {ephemeral: true},
	    {
		content: `Command with name ${commandId} does not exist!`
	    }
	);
    }else {
	const commandData = exists[0];
	const creatorId = commandData[1];
	const commandName = commandData[2];
	const source = commandData[6];
	const created = commandData[3].slice(0,-3);
	let modified = commandData[4];
	if (modified != null) {
	    modified = "";
	}else {
	    modified = `, last modified <t:${modified.slice(0,-3)}>`;
	}

	ackInteraction(
	    interaction,
	    "message",
	    {}, {
		embeds: [{
		    title: `Command "${commandName}" Info`,
		    color: 0x9400d3,
		    author: {
			name: `<@${creatorId}>`,
		    },
		    footer: {
			text: `Command created <t:${created}>${modified}`,
		    },
		    description: `\`\`\`python\n${source}\`\`\``,
		}]
	    }
	);
    }
    return
}
