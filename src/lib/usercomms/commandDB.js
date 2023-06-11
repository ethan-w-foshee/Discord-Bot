import { log } from "../../../deps.js";
import { db } from "../../../sql.js";

export class SQLiteHandler extends log.handlers.BaseHandler {
  constructor(levelName, options) {
    super(levelName, options);
    db.execute(`
CREATE TABLE IF NOT EXISTS logs(
    _id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    owner TEXT NOT NULL,
    name TEXT NOT NULL,
    created TEXT NOT NULL,
    modified TEXT NOT NULL,
    invoked INTEGER NOT NULL,
    code TEXT NOT NULL
);
	`);
    /* TODO:

	   Implement other tables such as for variable storage and
	   acess so that command variables can persist for longer than
	   the life of the executed user program */
  }
}

log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG", {
      formatter: (logRecord) => {
        let tags = "";
        if (logRecord.args.length) {
          tags += "\n\t\t";
          for (const tag of logRecord.args) {
            tags += " " + tag;
          }
        }
        return `[${logRecord.name}] <${logRecord.owner}> \n\`\`\`${logRecord.code}\`\`\``;
      },
    }),
    sql: new SQLiteHandler("DEBUG"),
  },
  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console", "sql"],
    },
  },
});

export const logger = log.getLogger();
logger.db = db;
