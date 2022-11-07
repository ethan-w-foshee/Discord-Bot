import { logger } from "../../logger.js";

export async function mcstatusEmbed(server) {

    let embed = {}

    /* If it matches anything that isn't alphanumeric or . : - _, kick out an error message. Otherwise, continue with the function. */
    if ( server.match(/[^\w.:\-_]/g) ) {
	embed = {
	    title: "Error",
	    description: "You provided an invalid server IP",
	    color: 11141120
	};
    } else {
	server = JSON.stringify(server).replaceAll(/[",',\|,\\,?,!,&,+,%,!,/]/g, "").trim();
	if ( server.length == 0 )
	    server = "None";
	const host = "https://api.mcsrvstat.us/2/" + server;
	logger.debug("Getting mcserver status from " + host);
	
	const result = await fetch(host).then((val) => val.json());

	logger.debug("Getting mcserver status success, parsing and returning")
	
	if (result.online) {
	    let motd = result.motd.clean[0];
	    if (result.motd.clean.length > 1)
		motd += '\n' + result.motd.clean[1];

	    embed = {
		title: result.hostname,
		color: 43520,
		description: motd,
		fields: [
		    {name: "IP", value: result.ip, inline: true},
		    {name: "Port", value: result.port, inline: true},
		    {name: "Version", value: result.version},
		    {name: "Players", value: result.players.online + " online (" + result.players.max + " max)"},
		]
	    };
	    if ( result.players.list ) {
		if ( result.players.online > 10 ) {
		    const playerList = result.players.list.slice(0, 9).join("\n") + "\n*" + (result.players.online - 9) + " more...*";
		    embed['fields'].push({name: "Players online", value: playerList});
		} else if ( result.players.online > 0) {
		    const playerList = result.players.list.join("\n");
		    embed['fields'].push({name: "Players online", value: playerList});
		}
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
	    };
	}
    }
    
    return embed;
}

