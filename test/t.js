const h = require('../helper')

async function t() {
	const ans = await h.ask('who?')
	console.log(`you said: ${ans}`)
}

t()

