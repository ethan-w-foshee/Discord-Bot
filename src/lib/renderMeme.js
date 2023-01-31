import { Image } from "../../deps.js";
import { Fonts } from "../../data/fonts.js";
import { memeages } from "../../data/imgs.js";

const memes = {
    bendoubt: {
	name: "BenDoubt.png",
	width: 1/3.5,
	height: 1/2,
	x: 2/3,
	y: 0,
	color: 0xffffffff,
	font: "GreatVibes-Regular.ttf"
    },
    whiteboard: {
	name: "Whiteboard.png",
	width: 0.40,
	height: 0.85,
	x: 0.55,
	y: 0.1,
	color: 0x000000ff,
	font: "CreteRound-Regular.ttf"
    }
};

export async function renderMeme(imgName, txt) {
    let meme = memes[imgName]
    if (!meme) {
	meme = memes["bendoubt"];
	txt = "Undefined meme";
    }
    
    const {
	name,
	width: w,
	height: h,
	x,
	y,
	color,
	font
    } = meme;
    const base = await Image.decode(memeages[name])

    const text = Image.renderText(
	Fonts[font],
	120, txt,
	color
    );
    
    base.composite(
	text.fit(base.width * w
	       , base.height * h)
	, base.width * x
	, base.height * y
    );
    const png = await base.encode();
    return png;
}
