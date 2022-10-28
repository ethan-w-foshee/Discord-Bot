// This file responsible for coordinating all other files and actually starting the bot
import { startBot } from "./deps.js";
import { bot } from "./bot.js"; // bot instance
import { updateBotCommands } from "./src/lib/commands.js";

// Commands
import "./src/commands/quote-commands.js";
import "./src/commands/roll.js";
import "./src/commands/ping.js";
import "./src/commands/moderation/kick.js"

updateBotCommands(bot)

// Start the bot
await startBot(bot);
