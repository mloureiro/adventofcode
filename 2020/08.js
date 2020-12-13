const fs = require('fs')
const data = fs.readFileSync('./08.txt')
	.toString()
	.split('\n')
	.filter(Boolean)

const parseInstructions = rawInstruction => {
	try {
		const [instruction, value] = rawInstruction.split(' ')

		return [instruction, parseInt(value, 10)]
	} catch (e) {
		console.error(`Fail to parse: "${rawInstruction}"`)
		throw e
	}
}

const firstChallenge = data => {
	let instructionsVisited = {}
	let accumulator = 0
	let hasFinished = false
	let i = 0
	while (!hasFinished) {
		if (instructionsVisited[i])
			return accumulator
		else
			instructionsVisited[i] = true

		const [action, value] = parseInstructions(data[i])
		switch (action) {
			case 'jmp':
				i += value
				break
			case 'acc':
				accumulator += value
			case 'nop':
			default:
				i++
		}
	}

	return accumulator
}

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
