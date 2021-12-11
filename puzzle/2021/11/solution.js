import { createMatrix } from '../../utils/matrix.js';

export const formatInput = input =>
	input
		.split('\n')
		.map(r => r.split('').map(Number));

const runStep = matrix => {
	const pointsOver9 = new Map();
	for (let x = 0; x < matrix.maxX; x++) {
		for (let y = 0; y < matrix.maxY; y++) {
			const node = matrix.get(x, y)
			node.v++;
			matrix.set(x, y, node.v)
			if (node.v > 9) pointsOver9.set(node.key, node)
		}
	}

	let points = Array.from(pointsOver9.values())
	const flashedPoints = new Set();
	while (points.length) {
		points.forEach(currentPoint => {
			matrix.getAdjacentsWithDiagonal(currentPoint.x, currentPoint.y)
				.forEach(adj => {
					if (!pointsOver9.has(adj.key)) {
						if (++adj.v > 9) pointsOver9.set(adj.key, adj);
						else matrix.set(adj.x, adj.y, adj.v);
					}
				});

			flashedPoints.add(currentPoint.key)
		})

		points = Array.from(pointsOver9.values())
			.filter(point => !flashedPoints.has(point.key))
	}

	pointsOver9
		.forEach(point => matrix.set(point.x, point.y, 0))

	return flashedPoints.size;
}

export const part1 = input => {
	const matrix = createMatrix(input)

	let total = 0;
	for (let i = 0; i < 100; i++)
		total += runStep(matrix);

	return total;
};

export const part2 = input => {
	const matrix = createMatrix(input)

	const totalElements = matrix.maxX * matrix.maxY;
	let i = 0;
	while(++i && runStep(matrix) !== totalElements);

	return i;
};
