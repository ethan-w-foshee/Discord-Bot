// Generate a pep talk

export async function genPeptalk() {
    // Get all the peptalk options
    const options = await loadOptions()

    let pepTalk = ""

    // For each phase (there are 4), choose a random one from
    // the list of options and append it to the pepTalk string
    for (let i = 0; i < 4; i++) {
	const choice = Math.floor(Math.random() * 100) % options[i].length
	pepTalk += options[i][choice]
    }

    return pepTalk
}

async function loadOptions() {
    const ret = []

    // Define all the input files to read
    const prefix = "./src/util/peptalk/";
    const inputFiles = ["phase1.txt", "phase2.txt", "phase3.txt", "phase4.txt"]

    for (const file of inputFiles) {

	//const filePath = import.meta.resolve(prefix + file);
	// Read then split by lines
	const raw = await Deno.readTextFile(prefix + file)
	let lines = raw.split("\n")

	// Sanitization. Ignore comments (#) or empty lines
	lines = lines.filter(line => (line.length != 0 && line[0] != "#"))

	// Add to "ret"
	ret.push(lines)
    }

    return ret
}
