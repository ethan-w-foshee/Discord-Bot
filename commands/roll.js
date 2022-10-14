import * as discordeno from "https://deno.land/x/discordeno@16.0.1/mod.ts";

export function parseRoll(message) {
    /* Parses and resends message after correcting for
     * embedded rolls and variable outcome statements.
     * Example Statement:
     * "#I roll a {1d20}" -> "I roll a 13"
     *               ^-- Roll subtitution
     * "#{1d20>=20?You ran away!:You tripped}"
     */
    const rolls = message.matchAll(/\{([^}]+)}/g);
    /* Parses message and returns contents of brackets in
     * the following form:
     * "{This} message {is}"
     * [ [ "{This}", "This" ], [ "{is}", "is"] ]
     */
    const replacements = [];
    for (const roll_ of rolls) {
        let sum = 0;
        const roll = roll_[1];
        const comparisons = /(>|<|=)(=)?/;
        const comparator = roll.search(comparisons);
        const dice = comparator == -1 ?
              roll : roll.substring(0, comparator);
        const dies = dice.split(' ');
        for (const die of dies) {
            const nums = die.split('d')
            if (nums.length == 1) {
                sum += parseInt(nums[0], 10);
            } else if (nums.length == 2) {
                const sides = parseInt(nums[1], 10);
                const times = parseInt(nums[0], 10);
                for (let i = 0; i < times; i++) {
                    sum += Math.floor(Math.random() * sides) + 1;
                }
            }
        }
	let response = undefined;
        if (comparator != -1) {
            const symbol = roll.match(comparisons)[0];
	    const rhs = roll.substring(comparator+symbol.length);
	    const num = parseInt(rhs);
	    let truth = false;
            switch (symbol) {
            case '>':
		truth = sum > num;
                break;
            case '>=':
		truth = sum >= num;
                break;
            case '<':
		truth = sum < num;
                break;
            case '<=':
		truth = sum <= num;
                break;
            case '=':
            case '==':
		truth = sum == num;
                break;
            }
	    if (truth) {
		response = rhs.match(/\?.*:/)[0];
		response = response.substring(1,response.length-1)
	    }else {
		response = rhs.match(/:.*$/)[0].substring(1)
	    }
	    response = response.trim()
        }
        replacements.push([ sum, response ]);
    }
    return replacements;
}

export function formatRoll(rolls) {
    let sep = '';
    let ret = '';
    for (const roll of rolls) {
	ret += sep;
	if (roll[1]) {
	    ret += '('+roll[0]+') '+roll[1]
	}else {
	    ret += roll[0].toString()
	}
	if (sep=='')
	    sep = ', ';
    }
    return ret
}

export default function rolling(bot, msg) {
    const cont = msg.content;
    const rolls = parseRoll(cont);
    const output = formatRoll(rolls);
    if (output!='') {
	discordeno.sendMessage(bot, msg.channelId, {
            content: output
	});
    }
}
