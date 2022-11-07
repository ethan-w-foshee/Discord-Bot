import {
    sendInteractionResponse,
    InteractionResponseTypes
} from "../../deps.js";
import { bot } from "../../bot.js";

export default function ackInteraction(interaction) {
  sendInteractionResponse(bot, interaction.id, interaction.token, {
    type: InteractionResponseTypes.DeferredChannelMessageWithSource,
  });
}
