const fs = require('fs')
const data = fs.readFileSync('./01.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(string => parseInt(string, 10))

const MATCH = 2020

const firstChallenge = data => {
	for (let i = 0; i < data.length - 1; i++)
		for (let j = i + 1; j < data.length; j++)
			if (data[i] + data[j] === MATCH)
				return data[i] * data[j]


	return null
}

const secondChallenge = data => {
	for (let i = 0; i < data.length - 2; i++)
		for (let j = i + 1; j < data.length - 1; j++)
			for (let k = j + 1; k < data.length; k++)
				if (data[i] + data[j] + data[k] === MATCH)
					return data[i] * data[j] * data[k]

	return null
}

console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
