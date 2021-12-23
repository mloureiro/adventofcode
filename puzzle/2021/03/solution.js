export const validation = [741950, 903810];

export const formatInput = input => input.split('\n');

export const part1 = data => {
	const count = data
		.reduce(
			(acc, row) => {
				row.split('').forEach((v, i) => acc[i] += parseInt(v, 10))
				return acc
			},
			Array(data[0].length).fill(0),
		)
		.map(p => parseInt(p, 10))
		.map(positionCount => positionCount * 2 > data.length ? '1' : '0')

	const gama = parseInt(count.join(''), 2);
	const epsilon = parseInt(count.map(v => v === '0' ? '1' : '0').join(''), 2);

	return gama * epsilon
}

const intersection = (a, b) =>
	a.reduce((a, v) => b.includes(v) ? [...a, v] : a, [])

export const part2 = data => {
	const invertedBinary = data.reduce(
		(acc, v) => {
			v.split('').forEach((c, i) => acc[i] += c)
			return acc;
		},
		Array(data[0].length).fill(''),
	)

	// TODO refactor code to calculate most and least in the same iteration
	let most = Array(data.length).fill(0).map((_, i) => i);
	for (
		let i = 0;
		i < invertedBinary.length && most.length > 1;
		i++
	) {
		const [sum, zeros, ones] = most
			.reduce(
				(acc, idx) => {
					if (invertedBinary[i][idx] === '0') {
						acc[1].push(idx)
					} else {
						acc[0]++
						acc[2].push(idx)
					}
					return acc;
				},
				[
					0, // sum,
					[], // zeros common
					[], // ones common
				]
			);

		most = sum * 2 >= most.length
			? intersection(most, ones)
			: intersection(most, zeros);
	}

	let least = Array(data.length).fill(0).map((_, i) => i);
	for (
		let i = 0;
		i < invertedBinary.length && least.length > 1;
		i++
	) {
		const [sum, zeros, ones] = least
			.reduce(
				(acc, idx) => {
					if (invertedBinary[i][idx] === '0') {
						acc[1].push(idx)
					} else {
						acc[0]++
						acc[2].push(idx)
					}
					return acc;
				},
				[
					0, // sum,
					[], // zeros common
					[], // ones common
				]
			);

		least = sum * 2 >= least.length
			? intersection(least, zeros)
			: intersection(least, ones);
	}

	const oxygen = parseInt(data[most[0]], 2)
	const co2 = parseInt(data[least[0]], 2)

	return oxygen * co2;
}
