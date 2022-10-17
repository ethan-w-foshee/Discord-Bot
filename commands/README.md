# commands folder

## Purpose

The purpose of the commands folder is *explicitly* for command declarations. Commands are slash commands, message commands, or user commands. The intent is that these files act somewhat similar to header files in C++. Function/feature definitions (actual code/functions) belong in the `/src/` folder.

## Adding a command

There are 3 major steps in adding a command.
1. Delcaration
2. Add to bot
3. Linking to definition

### Declaration

You can declare a command as such in a file placed in this folder:

```deno
import { bot } from "../bot.js" // import the main bot

export default bot.commands.push(
	{
		command1
	},
	{
		command2
	}
);
```

## Add to bot

After this declaration, you need to import this into the actual bot. In `/main.js`, add a line:

```deno
import "./commands/<filename>"

```

### Linking to definition

One more thing you need to do is link the command to the actual function (which would reside in `/src/`) to the command. Linking a command to a function is done through the "events" section of the bot declaration in `bot.js`. See that file for examples.

## How commands are added

Commands aren't really linked to a bot specifically. You use a bot to add, remove, edit commands to a server, then those can be called at any time. For our purposes, the bot is the actual compute node that carries out the command, so the bot does need to be online for a command to work.

In our structure, commands are added at startup based on what is in the list bot.commands. They are pushed to Discord servers in the `main.js` file. Every time the bot is restarted, all commands are upserted, meaning that all old commands are replaced with the configuration in bot.commands.
