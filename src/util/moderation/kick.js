import { kickMember } from "../../../deps.js";
import ackInteraction from "../ackInteraction.js";

export function kickSlash(bot, interaction) {
    const options = interaction.data.options
    const guild = interaction.guildId
    const user = options.filter(option => option.name == "user")[0].value
    const reason = options.filter(option => option.name == "reason")[0].value
    kickMember( bot, guild, user, reason );
    ackInteraction(
        interaction, "message", {},
        {
            content: `User <@${user}> kicked for "\`${reason}\`".`
        }
    );
}
