// Get a word's definition from Urban Dictionary

import { logger } from "../../logger.js";
import ackInteraction from "./ackInteraction.js";
import { editOriginalInteractionResponse } from "../../deps.js";

export function sendDefinition(bot, interaction, result, dictUsed) {
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
		"title": "Define " + result["word"]
		"color": 0xe03b2c,
		"fields": [{
		}]
	    }]
	};
    case 1: // If urban dictionary was used
	return {
	    "embeds": [{
		"title": "Define " + result["word"]
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

export async function urbanDictDefine(word) {
    const host = "https://api.urbandictionary.com/";
    let path = "v0/define?=" + word;

    const results = (await fetch(host + path)).json()["list"]

    if results.length == 0 {
	return {
	    "definition": "No definition found",
	    "permalink": "",
	    "word": word,
	    "example": "No examples available"
	}
    } else {
	return results[0]
    }
}
