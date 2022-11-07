import {
  ApplicationCommandOptionTypes,
  editOriginalInteractionResponse,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "../../deps.js";
import { bot } from "../../bot.js";
import { addBotCommand } from "../lib/commands.js";
import { createQuote, getNameFromUser } from "../util/quote.js";
import ackInteraction from  "../util/ackInteraction.js";

addBotCommand(bot, {
  description: "Create a very inspirational quote",
  name: "quote",
  options: [{
    name: "quote",
    description: "the quote text",
    type: ApplicationCommandOptionTypes.String,
    required: true,
  }, {
    name: "author",
    description: "who originally said the quote",
    type: ApplicationCommandOptionTypes.String,
    required: true,
  }],
  type: "slash",
  actions: [
    function (bot, interaction) {
      ackInteraction(interaction);

      /* Get options */
      const options = interaction.data.options;

      /* This needs to be a promise so that
	     * we can resolve the user's name if
	     * it's an @ THEN run the createQuote
	     * function */
      const getAuthorName = new Promise(function (resolve) {
        const inval = options.filter((option) =>
          option.name == "author"
        )[0].value;
        /* The value of the first match of
		 * any option entry whose "name"
		 * property is author. I.e. grab
		 * the value of the "author"
		 * parameter */
        if (inval.match(/^<@.*>$/)) {
          /* If it's an @ */
            logger.debug("at", "quote");
          const userId = inval.slice(2, inval.length - 1);
          /* Remove encapsulation, just
		     * get Id */
          getNameFromUser(bot, interaction.guildId, userId)
            .then((authorName) => resolve(authorName));
        } else {
          resolve(inval);
        }
      });
      const quoteContent = options.filter((option) =>
        option.name == "quote"
      )[0].value;

      /* Once authorName is resolved,
	     * continue */
      getAuthorName.then((authorName) => {
        /* Create quote, THEN edit the
		 * original ack with the image */
        createQuote(authorName, quoteContent)
          .then((image) =>
            editOriginalInteractionResponse(
              bot,
              interaction.token,
              { content: image },
            )
          );
      });
    },
  ],
});

addBotCommand(bot, {
  description: "Turn a message into an inspriational quote",
  name: "quote-message",
  type: "message",
  actions: [
    function (bot, interaction) {
      ackInteraction(interaction);
      /* Need to use an iterator to get
	     * content, just do "next" once to get
	     * the first element */
      const messageObject =
        interaction.data.resolved.messages.values().next().value;

      /* Once the author is retrieved,
	     * continue with things */
      getNameFromUser(bot, interaction.guildId, messageObject.authorId).then(
        (authorName) => {
          const quoteContent = messageObject.content;

          /*Create quote, THEN edit the
		 * original ack with the image */
          createQuote(authorName, quoteContent)
            .then((image) =>
              editOriginalInteractionResponse(
                bot,
                interaction.token,
                { content: image },
              )
            );
        },
      );
    },
  ],
});
