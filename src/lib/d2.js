const themes = [
    "0",
    "1",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "100",
    "101",
    "102",
    "103",
    "104",
    "105"
];

const layouts = [
    "dagre",
    "elk"
];

export async function renderD2(code, opts) {
    const enc = new TextEncoder();

    const theme = opts?.theme;

    const sketch = opts?.sketch;

    const layout = opts?.layout;

    const cmd = ["d2"];

    if (sketch)
	cmd.push("-s");
    if (theme in themes)
	cmd.push(...["-t",theme]);
    if (layout in layouts)
	cmd.push(...["-l",layout]);

    cmd.push(...["-","-"])
    
    const d2 = Deno.run({
	cmd,
	stderr: "piped",
	stdout: "piped",
	stdin: "piped"
    });
    const rsvg = Deno.run({
	cmd: ["rsvg-convert"],
	stderr: "piped",
	stdout: "piped",
	stdin: "piped"
    });

    /* The code being submitted is
     * small, no need to worry about
     * streams */
    console.log(code)
    await d2.stdin.write(enc.encode(code));
    await d2.stdin.close();
    const svg = await d2.output();
    await d2.stderr.close()
    await d2.close();

    let i = 0;
    let n = 0;
    do {
	n = await rsvg.stdin.write(svg.slice(i));
	i += n;
    } while(n)
    await rsvg.stdin.close();
    const png = await rsvg.output();
    await rsvg.stderr.close()
    await rsvg.close();
    
    return png;
}
