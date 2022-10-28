import { DB } from "./deps.js";

let dbdir = Deno.env.get("DB_DIR")
if (!dbdir) {
    dbdir = '.';
}

console.log(dbdir)

export const db = new DB(dbdir+"/starbot.db");
