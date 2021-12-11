export const validation = [57195069, 7409241];

export const formatInput = input => input.split('\n').map(Number);

export const part1 = (data, preambleSize = 25) => {
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
			idx > preambleSize
				? !isSumWithinList(item, self.slice(idx - preambleSize, idx))
				: false
		)
}

export const part2 = (data, preambleSize) => {
	const errElement = part1(data, preambleSize)
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
