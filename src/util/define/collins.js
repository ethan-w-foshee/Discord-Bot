// Get a word's definition from Collins' Dictionary
// WIP -- I don't have an API key yet

import { logger } from "../../../logger.js";

export async function collinsDefine(word) {
    const host = "https://api.urbandictionary.com/";
    const path = "v0/define?=" + word;

    logger.debug("Looking up "+word+" from Urban Dictionary");
    const results = (await fetch(host + path)).json()["list"];

    if (results.length == 0) {
	return {
	    "definition": "No definition found",
	    "permalink": "",
	    "word": word,
	    "example": "No examples available"
	};
    } else {
	return results[0];
    }
}
