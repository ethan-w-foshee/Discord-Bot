export async function renderD2(code) {
    const enc = new TextEncoder();

    const d2 = Deno.run({
	cmd: ["d2","-","-"],
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
    await d2.close();

    let i = 0;
    let n = 0;
    do {
	n = await rsvg.stdin.write(svg.slice(i));
	i += n;
    } while(n)
    await rsvg.stdin.close();
    const png = await rsvg.output();
    await rsvg.close();
    
    return png;
}
