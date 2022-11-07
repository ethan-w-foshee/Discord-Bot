import {
  ApplicationCommandOptionTypes,
  editOriginalInteractionResponse,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { ackInteraction } from "./quote-commands.js";

addBotcommand(bot, {
    description: "Query a minecraft server for general info",
    name: "mcserver",
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

	    console.log(options);
	    
	    const serverName = options.filter((option) =>
		option.name == "hostname")[0].value;
	    const serverPort = options.filter((option) =>
		option.name == "port")[0].value;

	    console.log(serverPort);

	    const host = "https://api.mcsrvstat.us/2/" + serverName + ":" + serverPort;
	    const result = await fetch(host).then((val) => val.json())
	    console.log(result);
	}
    ]
});
