export async function runBQN(code) {
    const enc = new TextEncoder();

    const bqn = Deno.run({
	cmd: ["cbqn"],
	stderr: "piped",
	stdout: "piped",
	stdin: "piped"
    });
    const bytes = enc.encode(code);
    let i = 0;
    let n = 0;
    do {
	n = await bqn.stdin.write(bytes.slice(i));
	i += n;
    } while(n)
    await bqn.stdin.close();
    const output = await bqn.output();
    await bqn.close();

    return output;
}
