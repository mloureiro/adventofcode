export const validation = [
	592, `
..##..##...##....##.####.####.#..#.#..#.
...#.#..#.#..#....#.#....#....#.#..#..#.
...#.#....#..#....#.###..###..##...#..#.
...#.#.##.####....#.#....#....#.#..#..#.
#..#.#..#.#..#.#..#.#....#....#.#..#..#.
.##...###.#..#..##..####.#....#..#..##..`
		.replace(/\./g, ' '),
];

export const formatInput = input => {
	let thresholdFound = false;
	const parsedInput = { folds: [], dots: [] }
	input.split('\n')
		.forEach(line => {
			if (!line)
				thresholdFound = true;
			else if (thresholdFound) { // extract axis and position
				const [axis, position] = line.match(/([^\s]+)=(\d+)$/).slice(-2);
				parsedInput.folds.push([axis, Number(position)]);
			} else // extract x,y coordinates
				parsedInput.dots.push(line.match(/^(\d+),(\d+)$/).slice(-2).map(Number));
		});

	return parsedInput;
}

const calculateMatrixSizeFromPoints = points => points
	.reduce(([x, y], [xc, yc]) => [x < xc ? xc : x, y < yc ? yc : y ], [0, 0])
	.map(axis => axis + 1); // length is 1 more than the positions

const createMatrix = (xMax, yMax) => {
	const dotToKey = (x, y) => `${x},${y}`
	const keyToDot = key => key.split(',').map(Number);

	let dotsKey = new Set();
	const getDots = () => [...dotsKey].map(keyToDot)
	return {
		xMax,
		yMax,
		get dots() { return getDots() },
		get count() { return dotsKey.size },
		addDot(x, y) { dotsKey.add(dotToKey(x, y)); },
		toString() {
			const output = Array(yMax).fill(null).map(() => Array(xMax).fill('.'))
			getDots().forEach(([x, y]) => output[y][x] = '#');
			return output.map(r => r.join('')).join('\n');
		}
	};
};

const fold = (matrix, axis, position) => {
	const [xae, yae] = axis === 'x'
		? [position, matrix.yMax]
		: [matrix.xMax, position];

	const newMatrix = createMatrix(xae, yae);
	matrix.dots.forEach(([x, y]) => {
		if (x < xae && y < yae) {
			newMatrix.addDot(x, y);
		} else {
			if (axis === 'x') {
				newMatrix.addDot(x - 2 * (x - position), y);
			} else {
				newMatrix.addDot(x, y - 2 * (y - position));
			}
		}
	});

	return newMatrix
}

export const part1 = input => {
	const [xMax, yMax] = calculateMatrixSizeFromPoints(input.dots);

	let matrix = createMatrix(xMax, yMax);
	input.dots.forEach(([x, y]) => matrix.addDot(x, y));

	return fold(matrix, ...input.folds[0]).count;
};


export const part2 = input => {
	const [xMax, yMax] = calculateMatrixSizeFromPoints(input.dots);

	let matrix = createMatrix(xMax, yMax);
	input.dots.forEach(([x, y]) => matrix.addDot(x, y));
	input.folds.forEach(([axis, position]) => matrix = fold(matrix, axis, position));

	return '\n' + matrix.toString().replace(/\./g, ' ');
};
