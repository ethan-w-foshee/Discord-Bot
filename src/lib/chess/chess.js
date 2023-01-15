const games = {};

// Unicode is rather large
const bufSize = 5000;

const dec = new TextDecoder();
const enc = new TextEncoder();

export async function make(name) {
    games[name] = Deno.run({
	    cmd: ["gnuchess","-q","-g","-m"],
	    stderr: "piped",
	    stdout: "piped",
	    stdin: "piped"
    });
    await waitOut(name);
}

export async function close(name) {
    const p = games[name];
    await p.stdout.close();
    await p.stdin.close();
    await p.stderr.close();
    await p.close();
}

async function input(name,txt) {
    const game = games[name];
    await game.stdin.write(enc.encode(`${txt}\n`));
    return await waitOut(name);
}

export async function board(name) {
    const output = await input(name,"show board");
    const lines = output.split('\n');
    const len = lines.length;
    return lines.splice(len-10,len-4).join('\n');
}

function isInputLine(buf) {
    const lines = dec.decode(buf).split('\n');
    const last = lines[lines.length-1];
    return last.match(/^(White|Black)[^:]*: /)!=null;
}

async function waitOut(name) {
    const game = games[name];
    const buffer = new Uint8Array(bufSize);
    let c;
    let i = 0;
    do {
	c = new Uint8Array(1);
	await game.stdout.read(c);
	buffer[i] = c[0];
	i+=1;
    } while (i < bufSize && !isInputLine(buffer))
    const txt = dec.decode(buffer);
    return txt;
}

export async function play(name, move) {
    const output = await input(name,move);
    const lines = output.split('\n');
    const len = lines.length;
    return lines.slice(0,len-1).join('\n');
}

export function valid(res) {
    return res.match(/invalid/i) == null
}
