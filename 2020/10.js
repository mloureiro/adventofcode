const fs = require('fs')
const data = fs.readFileSync('./10-e1.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(row => parseInt(row, 10))
	.sort((a, b) => a < b ? -1 : 1)

// add edges
data.unshift(0)
data.push(data[data.length - 1] + 3)

const firstChallenge = data => {
	let single = 0
	let triple = 0
	for (let i = 1; i < data.length; i++) {
		const diff = data[i] - data[i -1]
		if (diff === 1)
			single++
		else if (diff === 3)
			triple++
		else
			throw Error(`Difference "${diff}" is not allowed`)
	}

	return single * triple
}

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
