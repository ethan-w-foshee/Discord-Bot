import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";

const bot = discordeno.createBot({
    intents: discordeno.Intents.Guilds | discordeno.Intents.GuildMessages | discordeno.Intents.MessageContent,
    token: Deno.env.get("DISCORD_TOKEN"),
    events: {
	ready() {
	    console.log("Successfully connected to gateway");
	},
	messageCreate(bot, msg) {
	    let cont = msg.content;
	    if (cont.startsWith('#')) {
		/* Parses and resends message after correcting for
		 * embedded rolls and variable outcome statements.
		 * Example Statement:
		 * "#I roll a {1d20}" -> "I roll a 13"
		 *               ^-- Roll subtitution
		 * "#{1d20>=20?You ran away!:You tripped}"
		 */
		const rolls = cont.matchAll(/\{([^}]+)}/g);
		/* Parses message and returns contents of brackets in
		 * the following form:
		 * "{This} message {is}"
		 * [ [ "{This}", "This" ], [ "{is}", "is"] ]
		 */
		let replacements = [];
		for (const roll_ of rolls) {
		    let sum = 0;
		    const roll = roll_[1];
		    const comparisons = /(>|<|=)(=)?/;
		    const comparator = roll.search(comparisons);
		    const dice = comparator==-1?
			  roll:roll.substring(0,comparator);
		    const dies = dice.split(' ');
		    for (const die of dies) {
			const nums = die.split('d')
			if (nums.length==1) {
			    sum += parseInt(nums[0],10);
			}else if (nums.length==2) {
			    const sides = parseInt(nums[1],10);
			    const times = parseInt(nums[0],10);
			    for (let i=0; i<times; i++) {
				sum += Math.floor(Math.random()*sides)+1;
			    }
			}
		    }
		    replacements.push(sum);
		    /* if a compararison is made */
		    if (comparator != -1) {
			console.log("TODO: Verify Comparison Format")
			const symbol = roll.match(comparisons);
			switch (symbol) {
			case '>':
			    break;
			case '>=':
			    break;
			case '<':
			    break;
			case '<=':
			    break;
			case '=':
			case '==':
			    break;			    
			}
		    }
		}
		discordeno.sendMessage(bot, msg.channelId, {
		    content: replacements.toString()
		});
	    }
	}
    }
});

await discordeno.startBot(bot);
