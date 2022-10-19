// Enables dice rolling from inline commands in a message

import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { sendMessage } from "../../deps.js";
import { parseRoll, formatRoll } from "../util/rolls.js";

function rolling(bot, msg) {
    const cont = msg.content;
    const rolls = parseRoll(cont);
    const output = formatRoll(rolls);
    if (output!='') {
	sendMessage(bot, msg.channelId, {
            content: output
	});
    }
}

addBotCommand(bot, {
    event: "messageCreate",
    name: "Convert message to rolls",
    actions: [
	rolling
    ]
});
