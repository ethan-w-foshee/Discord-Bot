import { bot } from "../../../bot.js";
import { addBotCommand } from "../../lib/commands.js";
import { ApplicationCommandOptionTypes,
	 kickMember } from "../../../deps.js";
import ackInteraction from "../../util/ackInteraction.js";


function kickSlash(bot, interaction) {
    const options = interaction.data.options
    const guild = interaction.guildId
    const user = options.filter(option => option.name == "user")[0].value
    const reason = options.filter(option => option.name == "reason")[0].value
    kickMember(bot, guild, user, reason);

    ackInteraction(interaction, "message", {}, { content:`User <@${user}> kicked for reason: \`${reason}.\`` });
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
