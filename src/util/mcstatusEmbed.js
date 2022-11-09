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
	/* Stringify the server name and clean it up to avoid API/encoding errors.
	   This *should* never be hit because of the regex above, but it can be extra safe I guess */
	server = JSON.stringify(server).replaceAll(/[",',\|,\\,?,!,&,+,%,!,/]/g, "").trim();
	if ( server.length == 0 )
	    server = "None";

	/* Establish the url we're htiting */
	const url = "https://api.mcsrvstat.us/2/" + server;
	logger.debug("Getting mcserver status from " + url);
	
	const result = await fetch(url).then((val) => val.json());

	logger.debug("Getting mcserver status success, parsing and returning")

	/* If the server is online */
	if (result.online) {
	    /* Clean the motd and set it as the description. If more than 1 line, concat w/ a newline between */
	    let motd = result.motd.clean[0];
	    if (result.motd.clean.length > 1)
		motd += '\n' + result.motd.clean[1];

	    /* Build the embed given the API result */
	    embed = {
		title: result.hostname,
		color: 43520,
		description: motd,
		thumbnail: { url: "https://api.mcsrvstat.us/icon/" + server },
		fields: [
		    {name: "IP", value: result.ip, inline: true},
		    {name: "Port", value: result.port, inline: true},
		    {name: "Version", value: result.version},
		    {name: "Players", value: result.players.online + " online (" + result.players.max + " max)"},
		]
	    };

	    /* If a player list is provided, include it. If there are more than 10 provided, only include the first 9 players to avoid
	       the message from getting too long */
	    if ( result.players.list ) {
		if ( result.players.online > 10 ) {
		    const playerList = result.players.list.slice(0, 9).join("\n") + "\n*" + (result.players.online - 9) + " more...*";
		    embed['fields'].push({name: "Players online", value: playerList});
		} else if ( result.players.online > 0) {
		    const playerList = result.players.list.join("\n");
		    embed['fields'].push({name: "Players online", value: playerList});
		}
	    }
	}
	/* If the server is not online */
	else {
	    /* Build the embed given the API results. Much shorter and less information than an online server. */
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
