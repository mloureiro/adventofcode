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

const secondChallenge = data =>
	data.reduce(
		([total, groupSize, group], answers) => {
			if (!answers) {
				const completeGroupAnswerTotal = Object.keys(group)
					.reduce((total, key) =>
						group[key] === groupSize ? total + 1 : total, 0)

				return [total + completeGroupAnswerTotal, 0, {}]
			}

			answers.split('')
				.forEach(answer => group[answer] = (group[answer] || 0) + 1)

			return [total, groupSize + 1, group]
		},
		[0, 0, {}],
	)[0]

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
