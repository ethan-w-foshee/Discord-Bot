import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import {
    editOriginalInteractionResponse,
    InteractionResponseTypes,
    sendInteractionResponse,
} from "../../deps.js";

function makeComponents(page) {
    return [
	{
	    type: 1,
	    components: [
		{
		    type: 2,
		    label: "Prev",
		    style: 1,
		    customId: `log_prev${page}`,
		    disabled: page==1
		},
		{
		    type: 2,
		    label: `${page}`,
		    style: 2,
		    customId: "log_page",
		    disabled: true
		},
		{
		    type: 2,
		    label: "Next",
		    style: 1,
		    customId: `log_next${page}`
		}
	    ]
	}
    ]
}

function logGet(bot, interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    })
    let page = 1;
    if (interaction.data) {
	const action = interaction.data.custom_id;
	page = parseInt(action.charAt(action.length-1));
	if (action.startsWith("log_prev"))
	    page -=1;
	else if (action.startsWith("log_next"))
	    page +=1;
    }

    const rows = bot.logger.db.query(`SELECT level,date,msg FROM logs ORDER BY date DESC LIMIT 10 OFFSET ${(page-1)*10}`);
    let msg = '';
    for (const row of rows) {
	let date = new Date(row[1]);
	date = `${date.getFullYear()} ${date.getMonth()+1} ${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
	msg += `\u001b[3${Math.floor(row[0]/10)}m${date} ${row[2].slice(0,50)}\n`;
    }
    
    editOriginalInteractionResponse(bot, interaction.token, {
	content: `Log Preview
\`\`\`ansi
${msg}
\`\`\`
`,
	components: makeComponents(page)
    });
}

addBotCommand(bot, {
    type: "slash",
    name: "log",
    description: "Get some logs",
    actions: [
	logGet,
    ],
});
