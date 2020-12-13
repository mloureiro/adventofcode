const fs = require('fs')
const data = fs.readFileSync('./02.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const parseEntry = entry => {
	const [, min, max, char, pass] = /^(\d+)-(\d+) ([a-z\d]*): (.*)$/i.exec(entry)

	return { min, max, char, pass }
}

const firstChallenge = data => {
	let validEntries = 0
	for (let entry of data) {
		const { min, max, char, pass } = parseEntry(entry)

		const filtered = pass.replace(RegExp(`[^${char}]`, 'g'), '')
		const total = filtered.length

		if (min <= total && total <= max)
			validEntries++
	}

	return validEntries
}

const secondChallenge = data => {
	let validEntries = 0
	for (let entry of data) {
		const { min, max, char, pass } = parseEntry(entry)

		const first = pass[min - 1]
		const last = pass[max - 1]

		if (first === char && last !== char
			|| first !== char && last === char)
			validEntries++
	}

	return validEntries
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
