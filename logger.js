import { log } from "./deps.js";
import { db } from "./sql.js";

export class SQLiteHandler extends log.handlers.BaseHandler {
    constructor(levelName, options) {
	super(levelName, options);
	db.execute(`
CREATE TABLE IF NOT EXISTS logs(
    id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    date TEXT NOT NULL,
    level INTEGER NOT NULL,
    msg TEXT NOT NULL,
    tag TEXT
);
`);
    }
    format(logRecord) {
	return {
	    date: logRecord.datetime,
	    level: logRecord.level,
	    msg: logRecord.msg,
	};
    }
    log(log) {
	db.query(`
            INSERT INTO logs (date, level, msg) VALUES (:date, :level, :msg);
        `,
	    [
		log.date,
		log.level,
		log.msg,
	    ],
	);
    }
}

log.setup({
    handlers: {
	sql: new SQLiteHandler("DEBUG"),
    },
    loggers: {
	default: {
	    level: "DEBUG",
	    handlers: ["sql"],
	},
    },
});

export const logger = log.getLogger();
logger.db = db;
