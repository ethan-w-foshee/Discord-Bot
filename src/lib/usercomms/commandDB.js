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

    searchCommand(query) {
	let {owner, name} = query;
	let res;
	if (owner && name) {
	    res = db.query('SELECT * FROM commandDB WHERE owner = (?) AND name = (?);',
			   [
			       owner,
			       name
			   ]
	    );
	}else if (owner) {
	    res = db.query('SELECT * FROM commandDB WHERE owner = (?);',
			   [
			       owner
			   ]
	    );
	}else if (name) {
	    res = db.query('SELECT * FROM commandDB WHERE name = (?);',
			   [
			       name
			   ]
	    );
	}else {
	    res = db.query('SELECT * FROM commandDB;');
	}
	return res;
    }
    
    updateCommand(owner, name, code) {
	const res = this.searchCommand({owner, name});
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

    async runCommand(name) {
	const dec = new TextDecoder();
	const command = this.searchCommand({name})[0];
	const code = command[command.length-1];
	const tmpCodeDir = await Deno.makeTempDir();

	Deno.writeTextFileSync(`${tmpCodeDir}/main.py`, code);

	const timeoutPythonCommand = new Deno.Command("timeout", {
	    args: [
		"30s",
		"bwrap",
		"--unshare-all",
		"--ro-bind",
		`${tmpCodeDir}`,
		"/app",
		"--ro-bind",
		"/nix",
		"/nix",
		"python3",
		"-Iq",
		"/app/main.py"
	    ]
	});

	const pyOut = dec.decode((await timeoutPythonCommand.output()).stdout);

	await Deno.remove(tmpCodeDir, {recursive: true});

	return pyOut;
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
