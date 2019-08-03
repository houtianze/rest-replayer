const printer = require('../printer')
const h = require('../helper')

async function t() {
	const ans = await h.ask('who?')
	console.log(`you said: ${ans}`)
}

function t0() {
	let Runner = require('../runner')
	const replayer = new Runner({}, printer)
	replayer.listFormat()
}

t0()

