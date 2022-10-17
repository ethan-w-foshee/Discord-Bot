// This file responsible for coordinating all other files and actually starting the bot

import { startBot, upsertGlobalApplicationCommands } from "https://deno.land/x/discordeno@16.0.1/mod.ts"; // discordeno
import { bot } from "./bot.js" // bot instance

// Commands
import rolling from "./commands/roll.js"
import createQuote from "./commands/quote.js"

// Update all commands (which were added to bot.commands by other modules)
upsertGlobalApplicationCommands(bot, bot.commands);

// Start the bot
await startBot(bot);

