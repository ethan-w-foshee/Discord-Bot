import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";
import { ApplicationCommandOptionTypes,
	 kickMember } from "../../../deps.js";
import ackInteraction from "../../util/ackInteraction.js";


function kickSlash(bot, interaction) {
    const options = interaction.data.options
    guild = interaction.guildId
    user = options.filter(option => option.User == "User")[0].value
    reason = options.filter(option => option.Reason == "Reason")[0].value
    kickMember(
        {
            bot: bot,
            guildId: guild,
            userId: user,
            reason: reason
        }
    );
    editOriginalInteractionResponse(
	bot,
	interaction.token,
	{
	    content:`User ${user} kicked for ${reason}.`
	}
    );
}

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
