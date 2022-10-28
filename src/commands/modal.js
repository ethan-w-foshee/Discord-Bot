import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import {
  editOriginalInteractionResponse,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "../../deps.js";

function modal(bot, interaction) {
  console.log("I'm gonna figure it out!");
  sendInteractionResponse(bot, interaction.id, interaction.token, {
    type: InteractionResponseTypes.ChannelMessageWithSource,
    data: {
      "content": "This is a message with components",
    },
  });
}

addBotCommand(bot, {
  type: "slash",
  name: "modal",
  description: "Produce an example modal",
  actions: [
    modal,
  ],
});
