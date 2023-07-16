// Get a word's definition from Urban Dictionary

import { logger } from "../../../logger.js";

export async function urbanDictDefine(word) {
    const host = "https://api.urbandictionary.com/";
    const path = "v0/define?term=" + word;

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
