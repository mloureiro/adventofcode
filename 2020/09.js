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
	const errElement = firstChallenge(data)
	const list = data.slice(0, data.findIndex(x => x === errElement))

	const rangeSum = (list, [start, end]) =>
		list.slice(start, end + 1)
			.reduce((total, value) => total + value, 0)

	const sumEdges = list =>
		list.reduce(
			([smallest, largest], val) => {
				if (smallest === null)
					return [val, val]

				if (smallest > val)
					return [val, largest]

				if (largest < val)
					return [smallest, val]

				return [smallest, largest]
			},
			[null, null]
		)
			.reduce((total, val) => total + val, 0)

	for (let i = 0, j = 1; j < list.length;) {
		const sum = rangeSum(list, [i, j])

		if (sum === errElement)
			return sumEdges(list.slice(i, j + 1))

		if (sum > errElement) i++
		else j++

		if (j <= i)
			j = i + 1
	}

	return null
}

	console.log(`
Result
  1st: ${firstChallenge(data)}
  2nd: ${secondChallenge(data)}
`)
