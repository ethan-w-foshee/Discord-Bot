import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { encode } from "../lib/web.js";
import {
    sendMessage
} from "../../deps.js";

const codeRegex = /(?:```d2\n)([\s\S]*\n?)(?:```)/;

function diagram(bot, msg) {
    const cont = msg.content;
    //                          [Match everything]
    //                [Don't match]|       [Don't match]
    //                 v           v           v
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
    runIf: (_bot, msg) => {
	return (msg.content.match(codeRegex)) != null
    },
    actions: [
	diagram,
    ],
});
