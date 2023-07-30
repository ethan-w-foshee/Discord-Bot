// Get a word's definition from Urban Dictionary

import { logger } from "../../../logger.js";
import { editOriginalInteractionResponse, MessageComponentTypes, ButtonStyles } from "../../../deps.js";

export function sendDefinition(bot, interaction, result, dictUsed) {
    logger.debug("Sending a definition"); // This should be parameterized but I don't want to right now
    editOriginalInteractionResponse(
	bot,
	interaction.token,
	formatDefinition(result, dictUsed),
    );
}

export function formatDefinition(result, dictionary) {
    let data
    switch(dictionary) {
    case 0: {// If freedict dictionary was used
	data = {
	    embeds: [{
		title: "Define " + result.word,
		description: result.partOfSpeech ? result.partOfSpeech : "unknown",
		color: 0xe03b2c,
		fields: parseDefinitions(result.definitions)
	    }],
	    components: parseParts(result.word, result.availableParts, result.partOfSpeech)
	};
	break;
    } case 1: {// If urban dictionary was used
	data = {
	    embeds: [{
		title: "Define " + result["word"],
		color: 0xe03b2c,
		author: {
		    name: "Dictionary",
		    icon_url: "https://webstockreview.net/images/dictionary-clipart-cartoon-1.jpg"
		},
		url: result["permalink"],
		fields: [{
		    name: "1",
		    value: result["definition"].replaceAll("[", "").replaceAll("]", "") +
			"\n\nExample usage: "+result["example"].replaceAll("[", "").replaceAll("]", "")
		}]
	    }]
	};
	break;
    }}
    return data;
}

function parseDefinitions(fields) {
    const ret = [];
    for (let i=0; i<fields.length; i++) {
	ret.push({
	    name: (i+1).toString(),
	    value: fields[i].definition + "\n\nExample usage: " + fields[i]?.example
	});
    }
    return ret;
}

function parseParts(word, types, currentPart) {
    const ret = [];
    for (const i in types) {
	ret.push({
		type: MessageComponentTypes.Button,
		customId: "define_"+word+"_"+types[i],
		style: ButtonStyles.Secondary,
		label: types[i],
		disabled: (currentPart == types[i])
	    })
    }
    return [{
	type: MessageComponentTypes.ActionRow,
	components: ret
    }];
}
