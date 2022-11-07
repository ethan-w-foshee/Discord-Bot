import { logger } from "../../logger.js";

export async function mcstatusEmbed(server) {
    
    const host = "https://api.mcsrvstat.us/2/" + server;
    logger.debug("Getting mcserver status from " + host);
    
    const result = await fetch(host).then((val) => val.json());

    let embed = {}

    logger.debug("Getting mcserver status success, parsing and returning")

    let motd = result.motd.clean[0];
    if (result.motd.clean.length > 1)
	motd += '\n' + result.motd.clean[1];
    
    if (result.online) {
	embed = {
	    title: result.hostname,
	    color: 43520,
	    description: motd,
	    fields: [
		{name: "IP", value: result.ip},
		{name: "Port", value: result.port},
		{name: "Version", value: result.version},
		{name: "Players", value: result.players.online + " online (" + result.players.max + " max)"},
	    ]
	}
    } else {
	embed = {
	    title: result.hostname,
	    color: 11141120,
	    description: "Currently offline",
	    fields: [
		{name: "IP", value: result.ip},
		{name: "Port", value: result.port}
	    ]
	}
    }
    
    return embed;
}

