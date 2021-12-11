export const formatInput = input => input.split('\n').map(Number);

const MATCH = 2020

export const part1 = data => {
	for (let i = 0; i < data.length - 1; i++)
		for (let j = i + 1; j < data.length; j++)
			if (data[i] + data[j] === MATCH)
				return data[i] * data[j]

	return null
}

export const part2 = data => {
	for (let i = 0; i < data.length - 2; i++)
		for (let j = i + 1; j < data.length - 1; j++)
			for (let k = j + 1; k < data.length; k++)
				if (data[i] + data[j] + data[k] === MATCH)
					return data[i] * data[j] * data[k]

	return null
}
