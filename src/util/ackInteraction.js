import {
    sendInteractionResponse,
    InteractionResponseTypes,
    ApplicationCommandFlags
} from "../../deps.js";
import { bot } from "../../bot.js";

/* Translate simple names into cumbersome discordeno interaction response types */
const typeList = {
    thinking: InteractionResponseTypes.DeferredChannelMessageWithSource,
    deferred: InteractionResponseTypes.DeferredUpdateMessage,
    message: InteractionResponseTypes.ChannelMessageWithSource,
    autocomplete: InteractionResponseTypes.ApplicationCommandAutocompleteResult,
    modal: InteractionResponseTypes.Modal,
    pong: InteractionResponseTypes.Pong,
    update: InteractionResponseTypes.UpdateMessage
};

export default async function ackInteraction(interaction, type, flags, data) {
    /* Default type is thinking (deferred channel message w source) */
    if ( !(type in typeList) )
	type = "thinking";

    if ( data == undefined )
	data = {};

    /* Build based on provided type (translation) and data */
    const interactionResponse = {
	type: typeList[type],
	data: data
    };

    /* Flags */
    if ( flags != undefined ) {
	if (Object.keys(flags).includes("ephemeral") && flags.ephemeral)
	    interactionResponse['data']['flags'] |= ApplicationCommandFlags.Ephemeral;

	if (Object.keys(flags).includes("suppress_embeds") && flags.suppress_embeds)
	    interactionResponse['data']['flags'] |= ApplicationCommandFlags.SuppressEmbeds;
    }

    /* Send response */
    return await sendInteractionResponse(bot, interaction.id, interaction.token, interactionResponse);
}
