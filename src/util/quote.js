// Create an inspriational quote either based on a slash command or somebody else's message
// This uses a public(?) API that I "reverse engineered" from quozio.com

import { getMember } from "../../deps.js";
import { logger } from "../../logger.js";

export async function getNameFromUser(bot, guildId, userId) {
  const userObject = await getMember(bot, guildId, userId);
  return userObject.nick ? userObject.nick : userObject.user.username;
}

export async function createQuote(author, message) {
  const host = "https://quozio.com/";
  let path = "";

  // Submit quote
  path = "api/v1/quotes";
  const body = JSON.stringify({
    author: author,
    quote: message,
  });

  const quote = await fetch(host + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  }).then((val) => val.json());

    logger.debug("Created quote at: " + quote["url"],"quote");
  const quoteId = quote["quoteId"];

  // Choose a random template
  path = "api/v1/templates";
  const templates = await fetch(host + path).then((val) => val.json()).then((
    val,
  ) => val["data"]);

  const index = Math.floor(Math.random() * templates.length);
    logger.debug("Chose template from: " + templates[index]["url"], "quote");
  const templateId = templates[index]["templateId"];

  // Apply the template to the quote
  path = `api/v1/quotes/${quoteId}?templateId=${templateId}`;
  const imageUrl = await fetch(host + path).then((val) => val.json()).then((
    val,
  ) => val["imageUrls"]["medium"]);
    logger.debug("Created quote image at: " + imageUrl, "quote");

  // Return generated image
  return imageUrl;
}
