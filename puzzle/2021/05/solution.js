export const formatInput = input =>
	input.split('\n').map(line => {
		const [, xs, ys, xe, ye] = line.match(/^(\d+),(\d+)\s+?->\s+?(\d+),(\d+)$/)
		return [xs, ys, xe, ye].map(v => parseInt(v, 10))
	});

const arrayMax = arr => arr.reduce((m, v) => m > v ? m : v)

const calculateMapSize = vectors => {
	const [x, y] = vectors.reduce(
		([x, y], [xs, ys, xe, ye]) => [
			[...x, xs, xe],
			[...y, ys, ye]
		],
		[[], []],
	)

	return [arrayMax(x) + 1, arrayMax(y) + 1]
}

const vectorToPositions = ([xs, ys, xe, ye]) => {
	let xc = xs
	let yc = ys

	const next = () => {
		if (xc !== xe) xc = xc < xe ? xc + 1 : xc - 1
		if (yc !== ye) yc = yc < ye ? yc + 1 : yc - 1
	}

	const positions = [];
	while (xc !== xe || yc !== ye) {
		positions.push([xc, yc])
		next()
	}
	positions.push([xe, ye])

	return positions
}

export const part1 = data => {
	const vectors = data.filter(([xs, ys, xe, ye]) => xs === xe || ys === ye)
	const [xMax, yMax] = calculateMapSize(vectors)
	const map = Array(xMax).fill(null).map(() => Array(yMax).fill(0))

	vectors.map(vectorToPositions)
		.flat()
		.forEach(([x, y]) => map[x][y]++)

	return map.reduce((a, r) => a + r.reduce((a, v) => v > 1 ? a + 1 : a, 0),0)
}

export const part2 = vectors => {
	const [xMax, yMax] = calculateMapSize(vectors)
	const map = Array(xMax).fill(null).map(() => Array(yMax).fill(0))

	vectors.map(vectorToPositions)
		.flat()
		.forEach(([x, y]) => map[x][y]++)

	return map.reduce((a, r) => a + r.reduce((a, v) => v > 1 ? a + 1 : a, 0),0)
}

