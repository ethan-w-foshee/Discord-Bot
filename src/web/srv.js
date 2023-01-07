import { Application, Router,
         Image, gunzip, b64 } from "../../deps.js";
import { fonts } from "../../data/fonts.js";
import { renderD2 } from "../lib/d2.js";
import "../lib/images.js";

const router = new Router();

router
    .get("/", (context) => {
	context.response.body = "This do be Starbot tho";
    }).get("/time", async (context) => {
	console.log(context.request.headers);
	const now = new Date(Date.now());
	const background = new Image(256,256);
	background.fill(x => Image.hslToColor(x / background.width, 1, 0.5));
	
	const StarBot = Image.renderText(fonts[0], 50, "StarBot", 0x000000ff);
	background.composite(StarBot.resize(background.width,StarBot.height*(StarBot.width/background.width)),0,0)

	const time = Image.renderText(fonts[parseInt(fonts.length*Math.random())],
				      50, `${now.getHours()}:${now.getMinutes()}.${now.getSeconds()}`)
	background.composite(time.fit(background.width,background.height),
			     0, background-time.height*(time.width/background.width));
	const png = await background.encode();
	
	context.response.body = png;
	context.response.type = "image/png";
    }).get("/d2/:code", async (context) => {
	// TODO: Add GET options for things like '?theme=light'
	if (context?.params?.code) {
	    const dec = new TextDecoder();
	    const code = dec.decode(gunzip(b64.decode(context.params.code)));
	    context.response.body = await renderD2(code);
	    context.response.type = "image/png";
	}else {
	    context.response.body = "No D2";
	    context.response.type = "text/raw";	    
	}
  });

const starbotWeb = new Application();

starbotWeb.use(router.routes());
starbotWeb.use(router.allowedMethods());

export async function startWeb(port) {
    await starbotWeb.listen( {port: port} )
}
