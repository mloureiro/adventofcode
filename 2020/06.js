const fs = require('fs')
const data = fs.readFileSync('./06.txt')
	.toString()
	.split('\n')

const firstChallenge = data =>
	data.reduce(
		([total, group], answers) => {
			if (!answers)
				return [total + Object.keys(group).length, {}]

			answers.split('')
				.forEach(answer => group[answer] = true)

			return [total, group]
		},
		[0, {}],
	)[0]

const secondChallenge = data => {
	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
