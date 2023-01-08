import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import {
    editOriginalInteractionResponse,
    InteractionResponseTypes,
    sendInteractionResponse,
} from "../../deps.js";

function pong(bot, interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
	type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    })
    const rows = bot.logger.db.query(`SELECT level,date,msg FROM logs ORDER BY date DESC LIMIT 10`);
    let msg = '';
    for (const row of rows) {
	let date = new Date(row[1]);
	date = `${date.getFullYear()}${date.getMonth()+1}${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
	msg += `\u001b[3${Math.floor(row[0]/10)}m${date} ${row[2].slice(0,50)}\n`;
    }
    editOriginalInteractionResponse(bot, interaction.token, {
	content: `Log Preview
\`\`\`ansi
${msg}
\`\`\`
`,
	components: [
            {
		type: 1,
		components: [
                    {
			type: 2,
			label: "Prev",
			style: 1,
			customId: "log_prev"
                    },
		    {
			type: 2,
			label: "1",
			style: 2,
			customId: "log_page",
			disabled: true
                    },
		    {
			type: 2,
			label: "Next",
			style: 1,
			customId: "log_next"
                    }
		]
            }
	]
    });
}

addBotCommand(bot, {
    type: "slash",
    name: "log",
    description: "Poke the bot, just a bit",
    actions: [
	pong,
    ],
});
