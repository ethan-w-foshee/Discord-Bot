import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { parseRoll } from "./commands/roll.js";

Deno.test("Command Test (roll.js)", () => {
    const roll = parseRoll("{1d20}")[0][0];
    assert( (roll>=1) && (roll<=20) )
});

Deno.test("Command Test (roll.js)x2", () => {
    const roll = parseRoll("{1d1>=1?This is a test: This should not run}")[0][1]
    const rollNot = parseRoll("{1d1>=2?This is a test: This should not run}")[0][1]
    assert( roll=="This is a test" )
    assert( rollNot=="This should not run" )
});
