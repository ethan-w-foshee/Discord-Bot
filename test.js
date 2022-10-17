import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { parseRoll, formatRoll } from "./src/roll.js";
import { createQuote } from "./src/quote.js";

Deno.test("Command Test (roll.js)", async (t) => {
    await t.step("Rolling", () => {
	const input = "{1d20 1d10 1d5}"
	const roll = parseRoll(input)[0][0];
	console.log(input+" -> "+roll)
	assert( (roll>=3) && (roll<=35) );
    });
    await t.step("Conditional", () => {
	const condition = parseRoll("{1d1>=1?This is a test: This should not run}")
	assert( condition[0][1]=="This is a test" );
    });
    await t.step("Formatting", () => {
	const condition = parseRoll("{1d20} {1d1>=1?This is a test: This should not run}")
	const output = formatRoll(condition)
	console.log(output)
	assert(output)
    });
    await t.step("Quote generation", () => {
	const quoteImage = createQuote("author", "quote");
	console.log(quoteImage);
	assert(quoteImage.match(/https:\/\/.*\.jpg$/))
    });
});
