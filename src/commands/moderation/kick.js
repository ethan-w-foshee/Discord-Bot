import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";
import { editOriginalInteractionResponse,
	 sendInteractionResponse,
	 InteractionResponseTypes,
     kickMember } from "../../../deps.js";


function kickSlash(bot, interaction) {
    sendInteractionResponse(bot, interaction.id, interaction.token, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource
        });
    
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
        )
    editOriginalInteractionResponse(bot,
        interaction.token,
            {
                content:`User ${user} kicked for ${reason}.`
            }
        );
}

addBotCommand(bot, {
    type: "slash",
    default_member_permissions: 0x2,
    name: "kick",
    description: "Get rid of someone, anyone (within reason), temporarily.",
    options: [{
        name: "User",
        description: "The user to remove",
        type: ApplicationCommandOptionTypes.User,
        required: true
        },{
        name: "Reason",
        description: "Why they are being removed",
        type: ApplicationCommandOptionTypes.String,
        required: true,
        }],
    actions: [
	kickSlash
    ]
});
