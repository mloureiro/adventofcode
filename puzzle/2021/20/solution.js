export const validation = [5647, 15653];

export const formatInput = input =>
	input
		.replace(/#/g, '1')
		.replace(/\./g, '0')
		.split('\n\n')
		.reduce((algo, image) => [
			algo.split(''),
			image.split('\n').map(l => l.split('')),
		]);

function getAdjacents(x, y) {
	return [
		[-1, -1], [ 0, -1], [ 1, -1],
		[-1,  0], [ 0,  0],  [ 1,  0],
		[-1,  1], [ 0,  1], [ 1,  1],
	].map(([dx, dy]) => [x + dx, y + dy]);
}

function createMatrix({ matrix, height, width }) {
	const innerMatrix = matrix || Array(height).fill(null).map(() => Array(width).fill(null));
	return {
		get width() { return innerMatrix[0].length },
		get height() { return innerMatrix.length },
		get(x, y) { return innerMatrix[y]?.[x] },
		set(x, y, v) { innerMatrix[y][x] = v },
		toString() {
			return innerMatrix
				.map(l => l.join('')).join('\n')
				.replace(/1/g, '#')
				.replace(/0/g, '.');
		},
	}}

function calculatePixel([x, y], matrix, algo, iteration) {
	const bin = getAdjacents(x, y)
		.reduce((s, [x, y]) => s + (matrix.get(x, y) ?? algo[0] & iteration % 2), '');

	return algo[parseInt(bin, 2)];
}

export const part1 = ([algo, image], iterations = 2) => {
	let current = createMatrix({ matrix: image });
	for (let i = 0; i < iterations; i++) {
		const enhanced = createMatrix({
			height: current.height + 2,
			width: current.width + 2,
		});

		for (let x = -1; x <= current.width; x++)
			for (let y = -1; y <= current.height; y++)
				enhanced.set(
					x + 1,
					y + 1,
					calculatePixel([x, y], current, algo, i),
				);

		current = enhanced;
	}

	return current.toString().replace(/[^#]/g, '').length;
};

export const part2 = ([algo, image]) => {
	return part1([algo, image], 50);
};
