import { logger } from "../../logger.js";
import { db } from "../../sql.js";

const LOGTAG = "SSImage";

class SSImageBase {
    constructor(width=1, height=1, x=0, y=0) {
	this.type = undefined;
	this.render = undefined;
	this.relative = false;
	if ( width <= 0 || height <=0 ) {
	    logger.error("Images must have width and height > 0", LOGTAG)
	    return null;
	}
	const relWidth = (width <= 1 && width > 0);
	const relHeight = (height <= 1 && height > 0);
	if ( !( relWidth && relHeight ) ) {
	    logger.error("Both width and height must be relative or absolute", LOGTAG)
	    return null;
	}
    }
}

class SSImageURL extends SSImageBase {
    constructor(baseURL, width, height, x, y) {
	super(width, height, x, y)
	this.type = 'url';
	// TODO: check if url is valid
	this.url = baseURL;
    }
}

class SSImageText extends SSImageBase {
    constructor(text, width, height, x, y) {
	super(width, height, x, y)
	this.type = 'text';
	// TODO: check if url is valid
	this.text = text;
    }
}

class SSImage extends SSImageBase {
    constructor(width, height) {
	super(width, height)
	this.images = [];
    }
    toJSON() {
	return this.images;
    }
}

class SSImageDB {
    constructor() {
	db.execute(`
CREATE TABLE IF NOT EXISTS image_urls(
    _id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    url TEXT NOT NULL UNIQUE
    label TEXT
);
CREATE TABLE IF NOT EXISTS image_texts(
    _id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    txt TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS images(
    id TEXT PRIMARY KEY,
    img TEXT NOT NULL UNIQUE
) WITHOUT ROWID;
`);
    }
    addURL(url, label) {

    }
    getURL(label, url, id) {

    }
    addText(str) {

    }
    addImage(image) {

    }
}
