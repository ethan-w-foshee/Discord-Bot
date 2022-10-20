import { Intents, createBot } from "./deps.js";

import { enableCommandsPlugin,
         addBotCommand } from "./src/lib/commands.js"

export const bot = createBot({
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    token: Deno.env.get("DISCORD_TOKEN"),
    events: {}
});

enableCommandsPlugin(bot);
addBotCommand(bot, {
    event: "ready",
    actions: [function () {
	console.log("Connected to gateway!")
    }]
});
