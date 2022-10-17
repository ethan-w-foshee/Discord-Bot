import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";

export const bot = discordeno.createBot({
    intents: discordeno.Intents.Guilds | discordeno.Intents.GuildMessages | discordeno.Intents.MessageContent,
    token: Deno.env.get("DISCORD_TOKEN"),
    events: {
	ready() {
	    console.log("Successfully connected to gateway");
	},
	messageCreate(bot, msg) {
	    rolling(bot, msg)
	    if (msg.content == "###ping") {
		discordeno.sendMessage(bot, msg.channelId, {
		    content: "pong"
		});
	    }
	},
	interactionCreate(bot, interaction) {
	    console.log(interaction);
	}
    }
});

// Add an array to allow other modules to add commands
bot.commands = []
