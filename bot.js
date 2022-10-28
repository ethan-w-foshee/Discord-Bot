import { createBot, Intents } from "./deps.js";
import { addBotCommand, enableCommandsPlugin } from "./src/lib/commands.js";
import { logger } from "./logger.js";

export const bot = createBot({
  intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
  token: Deno.env.get("DISCORD_TOKEN"),
  events: {},
});

bot.logger = logger;

enableCommandsPlugin(bot);

addBotCommand(bot, {
    name: "ready",
    event: "ready",
    actions: [function (bot) {
	bot.logger.info("Connected to gateway! Bot online!");
    }],
});
