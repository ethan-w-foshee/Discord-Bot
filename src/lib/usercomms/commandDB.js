import { db } from "../../../sql.js";

class CommandDB {
    constructor() {
	db.execute(`
CREATE TABLE IF NOT EXISTS commandDB(
    _id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    owner TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
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

    queryCommandName(name) {
	const resp = db.query("SELECT owner,created FROM commandDB WHERE name = (name);", [name])
	return resp.length > 0;
    }
}

export const usergameDB = CommandDB();
