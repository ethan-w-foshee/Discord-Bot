import { Application, Router,
	 Image } from "../../deps.js";
import { fonts } from "../../data/fonts.js";
import { renderD2 } from "../lib/d2.js";
import { decode } from "../lib/web.js";
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
    }).get("/d2", async (context) => {
	const params = context.request.url.searchParams;
	const theme = params.get("theme");
	const sketch = params.get("sketch");
	const layout = params.get("layout");
	const bare = params.get("bare");
	let code = params.get('code');
	if (code) {
	    console.log(code);
	    code = decode(code);
	    context.response.body = await renderD2(code, {
		theme,
		sketch,
		layout,
		bare
	    });
	    context.response.type = "image/png";
	}else {
	    context.response.body = "No D2";
	    context.response.type = "text/html";
	}
  });

const starbotWeb = new Application();

starbotWeb.use(router.routes());
starbotWeb.use(router.allowedMethods());

export async function startWeb(port) {
    await starbotWeb.listen( {port: port} )
}
