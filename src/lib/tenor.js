const API_KEY = Deno.env.get("TENOR_TOKEN");

function ratelimit(fun, iri=1000, nper=1, poll=10) {
    const buf = new SharedArrayBuffer(8);
    const queue_dat = new Int32Array(buf);
    queue_dat[0] = 0; // number of calls in queue
    queue_dat[1] = 0; // Whether a call can be made
    async function wait() {
	const check = () => new Promise(resolve => {
	    setTimeout(()=>{
		const ret = Atomics.load(queue_dat,1)
		resolve(ret)
	    },poll)
	})
	while ((await check()) >= nper) {// We're just here to wait}
    }
    async function call_fun(...args) {
	let n = Atomics.load(queue_dat, 0);
	Atomics.add(queue_dat,0,1);
	while (n) {
	    await wait()
	    n-=1;
	}
	Atomics.add(queue_dat,1,1);
	setTimeout(()=>{
	    Atomics.sub(queue_dat,0,1);
	    Atomics.sub(queue_dat,1,1);
	}, iri)
	return fun(...args)
    }
    return call_fun
}

async function _fetchTenor(message) {
    const search = new URLSearchParams({
	q: message,
	key: API_KEY,
	client_key: 'starbot',
	country: 'US', // Randomize this maybe??
	locale: 'en_US', // Alongside this even?
	contentfilter: 'off', // Prevent less safe material?
	media_filter: 'tinymp4', // Gifs can be big, mp4s are nicer quality
	limit: 1,
    });
    const resp = await fetch(`https://tenor.googleapis.com/v2/search?${search}`)

    return resp
}

const fetchTenor = ratelimit(_fetchTenor, 1000);

export async function tenorGenerate(message) {
    const resp = await fetchTenor(message)
    const json = await resp.json();

    const first_res = json['results'][0];

    const desc = first_res['content_description'];

    const url = first_res['media_formats']['tinymp4']['url']

    return {
	url, desc
    }
}
