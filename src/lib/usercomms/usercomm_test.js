import { assert } from "../../../deps.js";
import { usergameDB } from "./commandDB.js";

Deno.test("User Command Testing", async (t) => {
    await t.step("Creating a Command", () => {
	const success = usergameDB.createCommand(
	    "TestUser",
	    "printHello",
	    `print("hello")`
	);
	assert(success);
    });

    await t.step("Searching for Command", () => {
	const res = usergameDB.searchCommand(
	    "TestUser",
	    "printHello",
	);
	assert(res.length == 1);
    });    
    
    await t.step("Updating a Command", () => {
	const success = usergameDB.updateCommand(
	    "TestUser",
	    "printHello",
	    `print("goodbye")`
	);
	assert(success);
    });

    await t.step("Create an existing Command", () => {
	const success = usergameDB.createCommand(
	    "TestUser",
	    "printHello",
	    `print("nihil")`
	);
	assert(!success);
    });

    await t.step("Updating a non-existent Command", () => {
	const success = usergameDB.updateCommand(
	    "TestUser",
	    "noway",
	    `print("goodbye")`
	);
	assert(!success);
    });
});
