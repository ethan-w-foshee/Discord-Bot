// This file responsible for coordinating all other files and actually starting the bot
import { startBot, walkSync } from "./deps.js";
import { bot } from "./bot.js"; // bot instance
import { updateBotCommands } from "./src/lib/commands.js";

// Import all commands in commands directory
for (const file of walkSync("./src/commands")) {
    if (file.isFile)
	if (file.name.endsWith(".js"))
	    import("./"+file.path);
}

updateBotCommands(bot);

// Start the bot
await startBot(bot);
