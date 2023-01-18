import { kickMember } from "../../../deps.js";
import {
    editOriginalInteractionResponse
} from "../../../deps.js";
// import { bot } from "../../../bot.js";

export default function kickSlash(bot, interaction) {
    const options = interaction.data.options
    const guild = interaction.guildId
    const user = options.filter(option => option.name == "user")[0].value
    const reason = options.filter(option => option.name == "reason")[0].value
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