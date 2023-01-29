import { Image } from "../../deps.js";
import { fonts } from "../../data/fonts.js";

export async function renderDoubt(txt) {
    console.log(`Rendering doubt of ${txt}`)
    const base = await Image.decode(Deno.readFileSync("./data/imgs/BenDoubt.png"))

    const text = Image.renderText(fonts[0],
				  50, txt)
    base.composite(text.fit(base.width,base.height),
			 0, base-text.height*(text.width/base.width));
    const png = await base.encode();
    return png;
}
