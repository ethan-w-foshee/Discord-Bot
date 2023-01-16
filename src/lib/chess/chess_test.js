import { assert } from "../../../deps.js";
import * as chess from "./chess.js";

const n = "game1";

Deno.test("Chess Testing", async (t) => {
    await t.step("Chess Input Test", async () => {
	await chess.make(n);
	await chess.play(n,"a4");
	await chess.play(n,"h6");
	const board = (await chess.board(n));
	await chess.close(n);
	const expect = await Deno.readTextFile("./src/lib/chess/expectedboard.txt");
	console.log(board);
	console.log("vs");
	console.log(expect);
	assert(board == expect);
    });
    await t.step("Chess Bad Move", async () => {
	await chess.make(n);
	const res = chess.valid(await chess.play(n,"a7"));
	await chess.close(n);
	assert(res == false);
    });
});
