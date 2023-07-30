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
		author: {
		    name: "Dictionary",
		    icon_rul: "https://webstockreview.net/images/dictionary-clipart-cartoon-1.jpg"
		},
		url: result.link,
		fields: parseDefinitions(result.definitions)
	    }],
	    components: parseParts(result.word, result.availableParts, result.partOfSpeech)
	};
	break;
    } case 1: {// If urban dictionary was used
	data = {
	    embeds: [{
		title: "Define " + result.word,
		color: 0xe03b2c,
		author: {
		    name: "Dictionary",
		    icon_url: "https://webstockreview.net/images/dictionary-clipart-cartoon-1.jpg"
		},
		url: result.permalink,
		fields: [{
		    name: "Definition 1",
		    value: (result["definition"].replaceAll("[", "").replaceAll("]", "") +
			    "\n\nExample usage: "+result["example"].replaceAll("[", "").replaceAll("]", "")).slice(0,1024)
		}]
	    }]
	};
	break;
    }}
    return data;
}

function parseDefinitions(fields) {
    const ret = [];
    let charSum = 0;
    for (let i=0; i<fields.length; i++) {
	if (charSum > 4000) {
	    break;
	}
	charSum += (fields[i].definition + fields[i].example).length
	ret.push({
	    name: "Definition "+(i+1),
	    value: fields[i].definition + "\n\nExample usage: " + fields[i].example
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
