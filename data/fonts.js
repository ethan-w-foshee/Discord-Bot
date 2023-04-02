import { walkSync } from "..//deps.js";
export const fonts = [];
export const Fonts = {};

// Import all commands in commands directory
for (const file of walkSync("./data/fonts")) {
    if (file.isFile) {
	if (file.name.endsWith(".ttf")) {
	    const ttf = await Deno.readFile("./"+file.path);
	    fonts.push(ttf);
	    Fonts[file.name] = ttf;
	}
    }
}
