// Get a word's definition from Collins' Dictionary
// WIP -- I don't have an API key yet

import { logger } from "../../../logger.js";

export const PartOfSpeech = {
    noun: "noun",
    adjective: "adjective",
    verb: "verb",
    adverb: "adverb",
    preposition: "preposition"
}

export async function freedictDefine(word, part) {
    const host = "https://api.dictionaryapi.dev/";
    const path = "api/v2/entries/en/" + word;

    logger.debug("Looking up "+word+" from freedictionary");
    const results = (await (await fetch(host + path)).json())

    if (results?.title == "No Definitions Found") {
	return {
	    "word": word,
	    "partOfSpeech": undefined,
	    "definitions": [{"definition": "No definitions found", "example": "No examples available"}]
	};
    } else {
	if (part == undefined) {
	    return {
		"word": word,
		"partOfSpeech": results[0].meanings[0].partOfSpeech,
		"definitions": results[0].meanings[0].definitions
	    }
	} else {
	    return {
		"word": word,
		"partOfSpeech": part,
		"definitions": results[0].meanings.filter((meaning) => meaning.partOfSpeech == part)[0].definitions
	    }
	}
    }
}
