import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { encode } from "../lib/web.js";
import {
    sendMessage
} from "../../deps.js";

function diagram(bot, msg) {
    const cont = msg.content;
    //                          [Match everything]
    //                [Don't match]|       [Don't match]
    //                 v           v           v
    const codeRegex = /(?:```d2\n)([\s\S]*\n?)(?:```)/;
    const code = cont.match(codeRegex);
    if (code != null) {
	const url = `https://starbot.syzygial.cc/d2?code=${encode(code[1])}`;
	sendMessage(bot, msg.channelId, {
	    content: url,
	});
    }
}

addBotCommand(bot, {
    type: "content",
    name: "Create D2 diagram",
    actions: [
	diagram,
    ],
});
