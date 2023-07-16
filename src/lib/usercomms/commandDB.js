import { db } from "../../../sql.js";

class CommandDB {
    constructor() {
	db.execute(`
CREATE TABLE IF NOT EXISTS commandDB(
    _id INTEGER PRIMARY KEY ASC AUTOINCREMENT,
    owner TEXT NOT NULL,
    name TEXT UNIQUE NOT NULL,
    created TEXT NOT NULL,
    modified TEXT,
    invoked INTEGER DEFAULT 0,
    code TEXT NOT NULL
);
	`);
	/* TODO:

	   Implement other tables such as for variable storage and
	   acess so that command variables can persist for longer than
	   the life of the executed user program */
    }

    createCommand(owner, name, code) {
	const now = Date.now()
	try {
	    db.query('INSERT INTO commandDB(owner, name, created, code) VALUES (?, ?, ?, ?);',
		     [
			 owner,
			 name,
			 now,
			 code,
		     ],
	    );
	} catch (error) {
	    // TODO: Use Logger
	    console.error(`Error: ${error}`);
	    return false;
	}
	return true;
    }

    searchCommand(owner, name) {
	const res = db.query('SELECT * FROM commandDB WHERE owner = (?) AND name = (?);',
			     [
				 owner,
				 name
			     ]
	);
	return res;
    }
    
    updateCommand(owner, name, code) {
	const res = this.searchCommand(owner, name);
	if (res.length == 1) {
	    const now = Date.now();
	    db.query('UPDATE commandDB SET (modified, code) = (?, ?) WHERE owner = (?) AND name = (?);'
		    ,[
			now,
			code,
			owner,
			name,
		    ],
	    );
	    return true;
	}
	console.error("No command exists to update")
	return false;
    }

    deleteCommand(owner, name) {
	db.query('DELETE FROM commandDB WHERE owner = (?) AND name = (?);',[
	    owner,
	    name
	])
    }
    
    queryCommandName(name) {
	const resp = db.query("SELECT owner,created FROM commandDB WHERE name = (name);", [name])
	return resp.length > 0;
    }
}

export const usergameDB = new CommandDB();

export function runGame(owner, name) {
    /*
       timeout 30s bwrap --unshare-all --ro-bind /nix /nix python3 -Iq -c 'print(sum(range(100)))
     */
    const _command = usergameDB.searchCommand(owner, name);
}
