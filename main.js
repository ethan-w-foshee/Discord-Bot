// This file responsible for coordinating all other files and actually starting the bot
import { startBot, upsertGlobalApplicationCommands } from "./deps.js";
import { bot } from "./bot.js" // bot instance

// Commands
import "./src/applicationCommands/quote-commands.js";

// Update all commands (which were added to bot.commands by other modules)
upsertGlobalApplicationCommands(bot, bot.commands);

// Start the bot
await startBot(bot);
