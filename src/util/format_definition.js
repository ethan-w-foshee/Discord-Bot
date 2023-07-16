// Get a word's definition from Urban Dictionary

import { logger } from "../../logger.js";
import { editOriginalInteractionResponse } from "../../deps.js";

export function sendDefinition(bot, interaction, result, dictUsed) {
    logger.debug("Sending a definition") // This should be parameterized but I don't want to right now
    editOriginalInteractionResponse(
	bot,
	interaction.token,
	formatDefinition(result, dictUsed),
    )
}

function formatDefinition(result, dictionary) {
    switch(dictionary) {
    case 0: // If collins dictionary was used
	return {
	    "embeds": [{
		"title": "Define " + result["word"],
		"color": 0xe03b2c,
		"fields": [{
		}]
	    }]
	};
    case 1: // If urban dictionary was used
	return {
	    "embeds": [{
		"title": "Define " + result["word"],
		"color": 0xe03b2c,
		"url": result["permalink"],
		"fields": [{
		    "name": "Definition",
		    "value": result["definition"]
		},{
		    "name": "Example",
		    "value": result["example"]
		}]
	    }]
	};
    }
}
