const printer = require('../printer')
const h = require('../helper')

async function t() {
	const ans = await h.ask('who?')
	console.log(`you said: ${ans}`)
}

function t0() {
	let Runner = require('../runner')
	let option = {target: 'https://jsonplaceholder.typicode.com'}
	let replayer = new Runner(option, printer)
	replayer.listFormat()
	replayer = new Runner({name: 'invalid$'}, printer)
}

t0()

