import { walkSync } from "..//deps.js";
export const fonts = [];

// Import all commands in commands directory
for (const file of walkSync("./data/fonts")) {
    if (file.isFile) {
	if (file.name.endsWith(".ttf")) {
	    console.log(`Loaded font ${file.name} from ${file.path}`);
	    const enc = new TextEncoder();
	    const ttf = await Deno.readFile("./"+file.path);
	    fonts.push(ttf);
	}
    }
}
