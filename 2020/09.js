const fs = require('fs')
const data = fs.readFileSync('./09.txt')
	.toString()
	.split('\n')
	.filter(Boolean)
	.map(string => parseInt(string, 10))

const firstChallenge = data => {
	const isSumWithinList = (sum, list) => {
		let i = 0, j = 1;
		while (i + 1 < list.length) {
			if (list[i] + list[j] === sum)
				return true

			j++
			if (j === list.length) {
				i++
				j = i + 1
			}
		}

		return false
	}

	return data
		.find((item, idx, self) =>
			idx > 25
				? !isSumWithinList(item, self.slice(idx - 25, idx))
				: false
		)
}

const secondChallenge = data => {
	return null
}

	console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
