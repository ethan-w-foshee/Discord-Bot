import { walkSync } from "../deps.js";

export const memeages = {};

// Import all commands in commands directory
for (const file of walkSync("./data/imgs/memes")) {
    if (file.isFile) {
	if (file.name.endsWith(".png")) {
	    const img = await Deno.readFile("./"+file.path);
	    memeages[file.name] = img;
	}
    }
}
