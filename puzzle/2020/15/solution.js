export const validation = [232, 18929178];

export const formatInput = input => input.split(',').map(Number);

const calculateValueInIteration = (data, iteration) => {
	const calculatePosition = (position, { previousPosition }) => ({
		difference: previousPosition
			? position - previousPosition
			: null,
		previousPosition: position
	})

	const map = {}

	for (let i = 0; i < data.length; i++)
		map[data[i]] = calculatePosition(i + 1, map[data[i]] || {})

	const lastElement = data[data.length - 1]
	let currentNumber = lastElement.difference || 0
	let previousNumber = null
	for (let i = data.length; i < iteration; i++) {

		map[currentNumber] = calculatePosition(i + 1, map[currentNumber] || {})
		previousNumber = currentNumber
		currentNumber = map[currentNumber].difference || 0
	}

	return previousNumber
}

export const part1 = data => {
	return calculateValueInIteration(data, 2020)
}

// TODO improve performance (>10min)
export const part2 = data => {
	return calculateValueInIteration(data, 30000000)
}
