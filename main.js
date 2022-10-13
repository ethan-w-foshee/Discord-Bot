import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";
import rolling from "./commands/roll.js"
import { botId } from "./ids/ids.js";

const bot = discordeno.createBot({
	intents: discordeno.Intents.Guilds | discordeno.Intents.GuildMessages | discordeno.Intents.MessageContent,
	token: Deno.env.get("DISCORD_TOKEN"),
	events: {
		ready() {
			console.log("Successfully connected to gateway");
		},
		messageCreate(bot, msg) {
			if (msg.authorId == botId || msg == " ") {
				console.log("This is my own message.")
			} else {
				rolling(bot, msg)
			}
		}
	}
});

await discordeno.startBot(bot);
