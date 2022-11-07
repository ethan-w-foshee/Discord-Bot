import {
  ApplicationCommandOptionTypes,
  editOriginalInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { ackInteraction } from "./quote-commands.js";
import { mcstatusEmbed } from "../util/mcstatusEmbed.js";

addBotCommand(bot, {
    description: "Query a minecraft server for general info",
    name: "mcstatus",
    options: [{
	name: "hostname",
	description: "Server IP or hostname",
	type: ApplicationCommandOptionTypes.String,
	required: true
    }, {
	name: "port",
	description: "Port that the server is listening on",
	type: ApplicationCommandOptionTypes.Number,
	required: false
    }],
    type: "slash",
    actions: [
	function (bot, interaction) {
	    ackInteraction(interaction);

	    /* Get options */
	    const options = interaction.data.options;

	    const serverName = options.filter((option) =>
		option.name == "hostname")[0].value;
	    
	    mcstatusEmbed(serverName)
		.then((result) =>
		    editOriginalInteractionResponse(
			bot,
			interaction.token,
			{ embeds: [ result ] }
		    )
		);
	}
    ]
});
