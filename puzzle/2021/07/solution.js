export const validation = [342730, 92335207];

export const formatInput = input => input.split(',').map(Number);

export const part1 = input => {
	const median = input.sort((a, b) => a < b ? -1 : a)[input.length / 2];
	return input.reduce((a, v) => a + Math.abs(v - median) ,0)
}

export const part2 = input => {
	const median = input.sort((a, b) => a < b ? -1 : a)[input.length / 2];
	const mean = input.reduce((a, v) => a + v) / 2;

	// ASSUMING mean IS SMALLER THAN median (works with our input)
	let leastFuelSpent = Number.MAX_SAFE_INTEGER;
	for (let i = median; i < mean; i++) {
		const currentFuelSpent = input.reduce((a, v) => {
			let total = 0
			let difference = Math.abs(v - i);
			for (let j = 1; j <= difference; j++) {
				total += j
			}

			return a + total
		} ,0)

		if (currentFuelSpent < leastFuelSpent) {
			leastFuelSpent = currentFuelSpent
		} else {
			return leastFuelSpent
		}
	}

	return leastFuelSpent
}
