import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { formatRoll, parseRoll } from "./src/util/rolls.js";
import { createQuote } from "./src/util/quote.js";
import { stupidify } from "./src/util/stupidenglish.js"

Deno.test("Command Test (roll.js)", async (t) => {
  await t.step("Rolling", () => {
    const input = "{1d20 1d10 1d5}";
    const roll = parseRoll(input)[0][0];
    console.log(input + " -> " + roll);
    assert((roll >= 3) && (roll <= 35));
  });
  await t.step("Conditional", () => {
    const condition = parseRoll("{1d1>=1?This is a test: This should not run}");
    assert(condition[0][1] == "This is a test");
  });
  await t.step("Formatting", () => {
    const condition = parseRoll(
      "{1d20} {1d1>=1?This is a test: This should not run}",
    );
    const output = formatRoll(condition);
    console.log(output);
    assert(output);
  });
});

Deno.test("Command test (quote.js)", async (t) => {
  await t.step("Quote generation", async () => {
    const quoteImage = await createQuote("author", "quote");
    assert(quoteImage.match(/https:\/\/.*\.jpg$/));
  });
});

Deno.test("Command test (stupidenglish.js)", async (t) => {
    await t.step("Message conversion", () => {
	const converted = stupidify("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
	assert(converted == "abcdefmnopqrstuvwxyzABCDEFMNOPQRSTUVWXYZ")
    });
});
