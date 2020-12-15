const fs = require('fs')
const data = fs.readFileSync('./input.txt')
	.toString()
	.trim()
	.split('\n')

const firstChallenge = data => {
	return null
}

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
