// Get a word's definition from Collins' Dictionary
// WIP -- I don't have an API key yet

import { logger } from "../../../logger.js";

export const PartOfSpeech = {
    noun: "noun",
    adjective: "adjective",
    verb: "verb",
    adverb: "adverb",
    preposition: "preposition",
    interjection: "interjection"
}

export async function freedictDefine(word, part) {
    const host = "https://api.dictionaryapi.dev/";
    const path = "api/v2/entries/en/" + word;
    const notFoundObj = {
	"word": word,
	"partOfSpeech": part,
	"definitions": [{"definition": "No definitions found", "example": "No examples available"}],
	"link": ""
    };

    logger.debug("Looking up "+word+" (type: "+part+") from freedictionary");
    const results = (await (await fetch(host + path)).json());

    if (results?.title == "No Definitions Found") {
	return notFoundObj;
    } else {
	const availableParts = results[0].meanings.map((x) => x.partOfSpeech)
	if (part == undefined) {
	    return {
		"word": word,
		"partOfSpeech": results[0].meanings[0].partOfSpeech,
		"definitions": results[0].meanings[0].definitions,
		"link": results[0].sourceUrls[0],
		"availableParts": availableParts
	    };
	} else {
	    const definitions = results[0].meanings.filter((meaning) => meaning.partOfSpeech == part)
	    if (definitions.length == 0) {
		return notFoundObj;
	    }
	    return {
		"word": word,
		"partOfSpeech": part,
		"definitions": definitions[0],
		"link": results[0].sourceUrls[0],
		"availableParts": availableParts
	    };
	}
    }
}
