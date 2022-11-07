export async function mcstatusEmbed(server) {
    const host = "https://api.mcsrvstat.us/2/" + server;
    const result = await fetch(host).then((val) => val.json());

    let embed = {}

    if (result.online) {
	embed = {
	    title: result.hostname,
	    color: 43520,
	    description: result.motd.clean[0],
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

