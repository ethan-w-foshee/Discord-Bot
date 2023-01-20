import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";
import { ApplicationCommandOptionTypes } from "../../../deps.js"
import kickSlash from "../../util/moderation/kick.js"

addBotCommand(bot, {
    type: "slash",
    // default_member_permissions: "0x2",
    name: "skick",
    description: "Get rid of someone, anyone (within reason), temporarily.",
    options: [{
        name: "user",
        description: "The user to remove",
        type: ApplicationCommandOptionTypes.User,
        required: true
    },{
        name: "reason",
        description: "Why they are being removed",
        type: ApplicationCommandOptionTypes.String,
        required: true,
    }],
    actions: [
	    kickSlash
    ]
});
