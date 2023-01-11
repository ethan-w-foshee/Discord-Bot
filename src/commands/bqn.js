import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { runBQN } from "../lib/bqn.js";
import {
    sendMessage
} from "../../deps.js";

function diagram(bot, msg) {
    const cont = msg.content;
    // Debated making a function for extracting code
    // But, I want to also add an options query
    // or args format to pass on
    const codeRegex = /(?:```bqn\n)([\s\S]*\n?)(?:```)/;

    let code = cont.match(codeRegex);
    
    if (code != null) {
	// System functions like files and FFI start with F You need to
	// clean the code submitted as to not let people escape the
	// sandbox and do something malicious	
	code = code[1].replaceAll(/•(F[\S]|SH)*/ig,'');
	
	runBQN(code).then( (res) => {
	    sendMessage(bot, msg.channelId, {
		content: res,
	    });
	});
    }
}

addBotCommand(bot, {
    type: "content",
    name: "Run BQN Code",
    actions: [
	diagram,
    ],
});
