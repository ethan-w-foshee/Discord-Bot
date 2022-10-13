import { assert } from "https://deno.land/std@0.159.0/testing/asserts.ts";
import { parseRoll } from "./commands/roll.js";

Deno.test("Command Test (roll.js)", () => {
    const roll = parseRoll("{1d20}");
    assert( (roll>=1) && (roll<=20) )
});
